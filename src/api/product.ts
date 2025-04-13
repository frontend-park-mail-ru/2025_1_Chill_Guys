import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface Product {
    id: string,
    name: string,
    image: string,
    price: number,
    reviewsCount: number,
    rating: number
}

export async function getProducts(): Promise<{ code: AJAXErrors, products?: Product[] }> {
    const response = await ajax.get("products");

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const products = rawData.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        reviewsCount: product.reviews_count,
        rating: product.rating,
    }));

    return { code: AJAXErrors.NoError, products: products };
}

export function getProductImagePath(product: Product): string {
    return `cover/files/${product.id}`;
}