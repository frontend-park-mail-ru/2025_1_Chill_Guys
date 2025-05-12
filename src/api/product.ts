import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    reviewsCount: number;
    rating: number;
    seller: {
        title: string;
        description: string;
    };

    discountPrice?: number;
    quantity?: number;
    status?: string;
}

export interface SearchResultItem {
    id: string;
}

export interface SearchResult {
    categories: SearchResultItem[];
    products: SearchResultItem[];
}

export interface SearchFullResult {
    categories: { categories: any[]; total: number };
    products: { products: any[]; total: number };
}

export interface Filters {
    sortType: string;
    minPrice: string;
    maxPrice: string;
    minRating: number;
}

export async function getProducts(
    offset: number,
): Promise<{ code: AJAXErrors; products?: Product[] }> {
    const response = await ajax.get("products/" + offset);

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

export async function getSearchResult(
    searchString: string,
): Promise<{ code: AJAXErrors; data?: SearchResult }> {
    const response = await ajax.post("suggestions", {
        sub_string: searchString,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data: SearchResult = await response.result.json();
    return { code: AJAXErrors.NoError, data };
}

export async function getSearchResultItems(
    searchString: string,
): Promise<{ code: AJAXErrors; data?: SearchFullResult }> {
    const response = await ajax.post("search/0", {
        sub_string: searchString,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data: SearchFullResult = await response.result.json();
    return { code: AJAXErrors.NoError, data };
}

export async function getSearchResultByFilters(
    searchString: string,
    offset: number,
    filters: Filters,
): Promise<{ code: AJAXErrors; data?: SearchFullResult }> {
    const request = {};

    if (filters.sortType !== "default" && filters.sortType)
        request["sort"] = filters.sortType;
    if (filters.minPrice) request["min_price"] = filters.minPrice;
    if (filters.minPrice) request["max_price"] = filters.maxPrice;

    if (filters.minRating) request["min_rating"] = filters.minRating;

    const query =
        "?" +
        Object.entries(request)
            .map(([K, V]) => `${K}=${encodeURIComponent(V as any)}`)
            .join("&");

    const response = await ajax.post("search/sort/" + offset + query, {
        sub_string: searchString,
    });

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data: SearchFullResult = await response.result.json();
    return { code: AJAXErrors.NoError, data };
}

export async function getProductsByIds(
    productIDs: string[],
): Promise<{ code: AJAXErrors; products?: Product[] }> {
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
        seller: product.seller,
    }));

    return { code: AJAXErrors.NoError, products: products };
}

export async function getProduct(
    productId: string,
): Promise<{ code: AJAXErrors; product?: Product }> {
    const response = await ajax.get(`product/${productId}`);

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
        seller: productRaw.seller,
    };
    return { code: AJAXErrors.NoError, product: product };
}

export function getProductImagePath(product: Product): string {
    return `cover/files/${product.id}`;
}

export async function getProductsByCategory(
    id: number,
): Promise<{ code: AJAXErrors; products?: Product[] }> {
    const response = await ajax.get(`products/category/${id}/0`);

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
        seller: product.seller,
    }));

    return { code: AJAXErrors.NoError, products: products };
}
