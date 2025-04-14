import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { BasketItem, clearBasket } from "./basket";
import { getProduct, getProductsByIds } from "./product";

interface OrderParametres {
    price: number,
    discountPrice: number
}

interface OrderPlacingParametres {
    address: string,
    payType: string,
}

interface OrderItem {
    productId: string,
    quantity: number
}

export async function saveOrderLocal(order: BasketItem[]): Promise<AJAXErrors> {
    localStorage.setItem("order", JSON.stringify(order.map((basketItem) => ({
        productId: basketItem.productId,
        quantity: basketItem.quantity
    }))));
    return AJAXErrors.NoError;
}

export async function calculateOrderParams(): Promise<{ code: AJAXErrors, parametres?: OrderParametres }> {
    const orderRaw: string = localStorage.getItem("order");

    if (orderRaw == null) {
        return { code: AJAXErrors.NoOrder };
    }

    let order: OrderItem[];
    try {
        order = JSON.parse(orderRaw);
    } catch (err) {
        return { code: AJAXErrors.InvalidOrder };
    }

    let orderProductsCounts: any = {};
    let orderProductsIDs: string[] = [];
    order.forEach((orderItem) => {
        orderProductsIDs.push(orderItem.productId);
        orderProductsCounts[orderItem.productId] = orderItem.quantity;
    });

    const { products, code } = await getProductsByIds(orderProductsIDs);
    if (code !== AJAXErrors.NoError) {
        return { code: AJAXErrors.InvalidOrder };
    }

    const parametres: OrderParametres = { price: 0, discountPrice: 0 };
    for (const item of products) {
        parametres.price += item.price * orderProductsCounts[item.id];
        parametres.discountPrice += (item.discountPrice || item.price) * orderProductsCounts[item.id];
    }

    return { code: AJAXErrors.NoError, parametres: parametres };
}

export async function sendOrder(parametres: OrderPlacingParametres): Promise<AJAXErrors> {
    const orderRaw: string = localStorage.getItem("order");

    if (orderRaw == null) {
        return AJAXErrors.NoOrder;
    }

    let order: OrderItem[];
    try {
        order = JSON.parse(orderRaw);
    } catch (err) {
        return AJAXErrors.InvalidOrder;
    }

    const response = await ajax.post("orders", {
        addressId: parametres.address,
        items: order
    });

    if (response.error || !response.result.ok) {
        return AJAXErrors.ServerError;
    }

    localStorage.removeItem("order");
    const code = await clearBasket();

    if (code !== AJAXErrors.NoError) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}