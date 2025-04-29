import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { Filters } from "./product";

export interface Categories {
    total: number

    categories: Category[],
}

export interface Category {
    id: string,

    name: string,
}

export async function getAllCategories(): Promise<{ code: AJAXErrors, data?: Categories }> {
    const response = await ajax.get("categories");

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
    const categories = {
        total: rawData.total,
        categories: rawData.categories.map((category: any) => ({
            id: category.id,
            name: category.name,
        }))
    };
    return { code: AJAXErrors.NoError, data: categories };
}

export async function getSearchCategoryByFilters(categoryId: string, searchString: string, filters: Filters): Promise<{ code: AJAXErrors, products?: any[] }> {
    const request = {};

    if (filters.sortType && filters.sortType !== "default") request["sort"] = filters.sortType;
    if (filters.minPrice) request["min_price"] = filters.minPrice;
    if (filters.maxPrice) request["max_price"] = filters.maxPrice;
    if (filters.minRating) request["min_rating"] = filters.minRating;

    const query = "?" + Object.entries(request).map((([K, V]) =>
        `${K}=${encodeURIComponent(V as any)}`
    )).join("&");

    const response = await ajax.get(`products/category/${categoryId}/0` + (query !== "?" ? query : ""));

    if (response.error || !response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const data = await response.result.json();
    return { code: AJAXErrors.NoError, products: data.products };
}