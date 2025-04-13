import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface Basket {
    total: number,
    totalPrice: number,
    totalPriceDiscount: number,
    products: BasketItem[],
}

export interface BasketItem {
    id: string,
    productId: string,
    productName: string,
    productPrice: number,
    productImage: string,
    priceDiscount: number,
    quantity: number,
}

export async function getBasket(): Promise<{ code: AJAXErrors, data?: Basket }> {
    const response = await ajax.get("basket");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const basket = {
        total: rawData.total,
        totalPrice: rawData.total_price,
        totalPriceDiscount: rawData.total_price_discount,
        products: rawData.products.map((product: any) => ({
            id: product.id,
            productId: product.product_id,
            productName: product.product_name,
            productPrice: product.product_price,
            productImage: product.product_image,
            priceDiscount: product.price_discount,
            quantity: product.quantity,
        }))
    };

    return { code: AJAXErrors.NoError, data: basket };
}

export async function addToBasket(productId: string): Promise<AJAXErrors> {
    const response = await ajax.post(`basket/${productId}`, {});

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function updateProductQuantity(productId: string, newQuantity: number)
    : Promise<{ code: AJAXErrors, lastProduct?: boolean }> {
    const response = await ajax.post(`basket/${productId}`, {
        quantity: newQuantity
    });

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (response.result.status == 422) {
        return { code: AJAXErrors.ProductQualityLimitOut };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    return { code: AJAXErrors.NoError, lastProduct: rawData.remain_quantity == 0 };
}

export async function removeFromBasket(productId: string): Promise<AJAXErrors> {
    const response = await ajax.del(`basket/${productId}`, {});

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function clearBasket(): Promise<AJAXErrors> {
    const response = await ajax.del(`basket`, {});

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}