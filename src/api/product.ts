import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { Category } from "./categories";

export interface Product {
    id: string,
    name: string,
    description: string,
    image: string,
    price: number,
    discountPrice: number,
    reviewsCount: number,
    rating: number
}

export interface SearchResultItem {
    id: string,
}

export interface SearchResult {
    categories: SearchResultItem[],
    products: SearchResultItem[]
}

export interface SearchFullResult {
    categories: { categories: any[], total: number },
    products: { products: any[], total: number },
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

export async function getSearchResult(searchString: string): Promise<{ code: AJAXErrors, data?: SearchResult }> {
    const response = await ajax.post("/suggestions", {
        sub_string: searchString,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data: SearchResult = await response.result.json();
    return { code: AJAXErrors.NoError, data };
}

export async function getSearchResultItems(searchString: string): Promise<{ code: AJAXErrors, data?: SearchFullResult }> {
    const response = await ajax.post("/search", {
        sub_string: searchString,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data: SearchFullResult = await response.result.json();
    return { code: AJAXErrors.NoError, data };
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
        image: product.preview_image_url,
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
        description: productRaw.description,
        image: productRaw.preview_image_url,
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

export async function getProductsByCategory(id: number): Promise<{ code: AJAXErrors, products?: Product[] }> {
    const response = await ajax.get(`products/category/${id}`);

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
