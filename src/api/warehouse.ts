import ajax, { AJAXRequestContentType } from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { Product } from "./product";

export interface WarehouseOrderProduct {
    id: string;
    name: string;
    imageUrl: string;
    quantity: number;
}

export interface WarehouseOrder {
    id: string;
    status: string;
    addressString: number;
    addressCoordinates: string;
    products: WarehouseOrderProduct[]
}

export async function getWarehouseOrders(): Promise<{ code: AJAXErrors, data?: WarehouseOrder[] }> {
    const response = await ajax.get("warehouse/get");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status === 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const orders: WarehouseOrder[] = rawData.map((order) => ({
        id: order.id,
        status: order.status,
        addressString: order.address?.AddressString,
        addressCoordinates: order.address?.coordinate,
        products: order.products.map((product: any) => ({
            id: product.product_id,
            name: product.product_name,
            imageUrl: product.ProductImageURL,
            quantity: product.ProductQuantity,
        }))
    }));
    return { code: AJAXErrors.NoError, data: orders };
}

export async function sendWarehouseOrder(id: string): Promise<AJAXErrors> {
    const response = await ajax.post("warehouse/update", {
        orderID: id
    });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status === 401) {
        return AJAXErrors.Unauthorized;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}