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

interface Order {
    id: string,
    status: string,
    price: number,
    products: string[],
    addressName: string,
}

export async function saveOrderLocal(order: BasketItem[]): Promise<AJAXErrors> {
    localStorage.setItem("order", JSON.stringify(order.filter((basketItem) => basketItem.remainQuantity >= 0).map((basketItem) => ({
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

export async function getAllOrders(): Promise<{ orders?: Order[], code: AJAXErrors }> {
    const response = await ajax.get("orders");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.NoError, orders: [] };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const orders = rawData.orders.map((order: any) => ({
        id: order.id,
        status: order.status,
        price: order.totalDiscountPrice,
        products: order.products.map((product: any) => product.ProductImageURL),
        addressName: order.address.AddressString
    }));

    return { code: AJAXErrors.NoError, orders: orders };
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