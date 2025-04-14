import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import {Category} from "./categories";

export interface Product {
    id: string,
    name: string,
    image: string,
    price: number,
    discountPrice: number,
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
        discountPrice: product.discount_price,
        reviewsCount: product.reviews_count,
        rating: product.rating,
    }));

    return { code: AJAXErrors.NoError, products: products };
}

export async function getProductsByIds(productIDs: string[]): Promise<{ code: AJAXErrors, products?: Product[] }> {
    const response = await ajax.post("products/batch", { productIDs });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const rawData = await response.result.json();
    const products = rawData.products.map((product: any) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        discountPrice: product.discount_price,
        reviewsCount: product.reviews_count,
        rating: product.rating,
    }));

    return { code: AJAXErrors.NoError, products: products };
}

export async function getProduct(productId: string): Promise<{ code: AJAXErrors, product?: Product }> {
    const response = await ajax.get(`products/${productId}`);

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status === 400 || response.result.status === 401) {
        return { code: AJAXErrors.NoProduct };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const productRaw = await response.result.json();
    const product: Product = {
        id: productRaw.id,
        name: productRaw.name,
        image: productRaw.image,
        price: productRaw.price,
        discountPrice: productRaw.price_discount,
        reviewsCount: productRaw.reviews_count,
        rating: productRaw.rating,
    };
    return { code: AJAXErrors.NoError, product: product };
}

export function getProductImagePath(product: Product): string {
    return `cover/files/${product.id}`;
}

export async function getProductsByCategory(category: Category): Promise<{ code: AJAXErrors, products ?: Product[] }> {
    const response = await ajax.get(`products/category/${category.id}`);

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
