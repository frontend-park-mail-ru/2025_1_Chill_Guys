import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface Review {
    id: string;
    name: string;
    surname?: string;
    imageURL?: string;
    rating: number;
    comment: string;
}

export async function getComments(
    productId: string,
    offset: number,
): Promise<{ code: AJAXErrors; reviews?: Review[] }> {
    const response = await ajax.post("review", {
        productID: productId,
        offset,
    });

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401 || response.result.status == 404) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    return { code: AJAXErrors.NoError, reviews: rawData.reviews };
}

export async function sendComment(
    productId: string,
    rating: number,
    comment: string,
): Promise<AJAXErrors> {
    const response = await ajax.post("review/add", {
        productID: productId,
        rating,
        comment,
    });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401 || response.result.status == 404) {
        return AJAXErrors.Unauthorized;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }
    return AJAXErrors.NoError;
}
