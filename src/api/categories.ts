import ajax from "bazaar-ajax";
import {AJAXErrors} from "./errors";

export interface Categories {
    total: number

    categories: Category[],
}

export interface Category {
    id: string,

    name: string,
}

export async function getAllCategories(): Promise<{ code: AJAXErrors, data ?: Categories }> {
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
        categories: rawData.categories.map((category: any) =>({
            id: category.id,
            name: category.name,
        }))
    };
    return { code: AJAXErrors.NoError, data: categories };
}
