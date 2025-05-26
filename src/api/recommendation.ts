import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";
import { Product } from "./product";

export async function getRecommendations(product: number): Promise<{ code: AJAXErrors; products?: Product[] }> {
    const response = await ajax.get("recommendation/" + product);

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