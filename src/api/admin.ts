import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface UserRequest {
    id: string;
    email: string;
    name: string;
    surname: string;
    role: string;
    sellerInfo: {
        title: string;
        description: string;
    };
}

export interface ProductRequest {
    id: string;
    name: string;
    image: string;
    price: number;
    sellerInfo: {
        title: string;
        description: string;
    };
}

export interface Promocode {
    id: string;
    code: string;
    percent: number;
    startDate: Date;
    endDate: Date;
}

export async function getUserRequests(
    offset: number,
): Promise<{ code: AJAXErrors; requests?: UserRequest[] }> {
    const response = await ajax.get("admin/users/" + offset);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (response.result.status == 403) {
        return { code: AJAXErrors.PermissionsDenied };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const requests: UserRequest[] = rawData.users.map((request: any) => ({
        id: request.id,
        email: request.email,
        name: request.name,
        surname: request.surname,
        role: request.role,
        sellerInfo: request.seller_info,
    }));
    return { code: AJAXErrors.NoError, requests };
}

export async function sendUserRequestAnswer(
    userId: string,
    accepted: boolean,
): Promise<AJAXErrors> {
    const response = await ajax.post("admin/user/update", {
        userID: userId,
        update: accepted ? 1 : 0,
    });

    if (response.error) {
        return AJAXErrors.NoError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (response.result.status == 403) {
        return AJAXErrors.PermissionsDenied;
    }

    if (!response.result.ok) {
        return AJAXErrors.NoError;
    }

    return AJAXErrors.NoError;
}

export async function getProductsRequests(
    offset: number,
): Promise<{ code: AJAXErrors; requests?: ProductRequest[] }> {
    const response = await ajax.get("admin/products/" + offset);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (response.result.status == 403) {
        return { code: AJAXErrors.PermissionsDenied };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const requests: ProductRequest[] = rawData.products.map((request: any) => ({
        id: request.id,
        name: request.name,
        image: request.image,
        price: request.price,
        sellerInfo: request.seller,
    }));
    return { code: AJAXErrors.NoError, requests };
}

export async function sendProductRequestAnswer(
    productId: string,
    accepted: boolean,
): Promise<AJAXErrors> {
    const response = await ajax.post("admin/product/update", {
        productID: productId,
        update: accepted ? 1 : 0,
    });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (response.result.status == 403) {
        return AJAXErrors.PermissionsDenied;
    }

    if (!response.result.ok) {
        return AJAXErrors.NoError;
    }

    return AJAXErrors.NoError;
}

export async function createPromocode(
    name: string,
    percent: any,
    start: Date,
    end: Date,
): Promise<AJAXErrors> {
    const response = await ajax.post("promo/", {
        code: name,
        percent: parseInt(percent),
        start_date: start.toISOString(),
        end_date: end.toISOString(),
    });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.Unauthorized;
    }

    if (response.result.status == 403) {
        return AJAXErrors.PermissionsDenied;
    }

    if (!response.result.ok) {
        return AJAXErrors.NoError;
    }

    return AJAXErrors.NoError;
}

export async function getPromocodes(
    offset: number,
): Promise<{ code: AJAXErrors; data?: Promocode[] }> {
    const response = await ajax.get("promo/" + offset);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (response.result.status == 403) {
        return { code: AJAXErrors.PermissionsDenied };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.NoError };
    }

    const rawData = await response.result.json();
    const promocodes: Promocode[] = rawData.promos.map((promo) => ({
        id: promo.id,
        code: promo.code,
        percent: promo.percent,
        startDate: promo.start_date,
        endDate: promo.end_date,
    }));
    return { code: AJAXErrors.NoError, data: promocodes };
}
