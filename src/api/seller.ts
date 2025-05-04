import ajax, { AJAXRequestContentType } from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { Product } from "./product";

export interface ProductForm {
    name: string,
    description: string,
    price: number,
    quantity: number,
    sellerId: string,
    category: string,
}

export async function sendRequest(title: string, description: string): Promise<AJAXErrors> {
    const response = await ajax.post("users/update-role", { title, description });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function getSellerProducts(offset: number): Promise<{ code: AJAXErrors, products?: Product[] }> {
    const response = await ajax.get("seller/products/" + offset);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status === 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (response.result.status === 403) {
        return { code: AJAXErrors.PermissionsDenied };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const products: Product[] = (rawData.products ?? []).map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.preview_image_url,
        price: product.price,
        reviewsCount: product.reviews_count,
        rating: product.rating,
        status: product.quantity > 0 ? product.status : "empty",
        quantity: product.quantity,
    }))
    return { code: AJAXErrors.NoError, products };
}

export async function addProductInformation(product: ProductForm): Promise<{ code: AJAXErrors, productId?: string }> {
    const response = await ajax.post("seller/add-product", {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        seller_id: product.sellerId,
        category: product.category,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    return { code: AJAXErrors.NoError, productId: rawData.id };
}

export async function addProductImage(imageId: string, productImage: any): Promise<AJAXErrors> {
    const form = new FormData();
    form.append("file", productImage);
    const response = await ajax.post("seller/add-image/" + imageId, form, { type: AJAXRequestContentType.FORM });

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