import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface PromocodeCheck {
    valid: boolean;
    percent?: number;
}

export async function checkPromocode(code: string): Promise<{ code: AJAXErrors, data?: PromocodeCheck }> {
    const response = await ajax.post("promo/check", {
        code: code,
    });

    if (response.error) {
        return { code: AJAXErrors.ServerError }
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
    const promocodeCheck: PromocodeCheck = {
        valid: rawData.is_valid,
        percent: rawData.percent,
    }
    return { code: AJAXErrors.NoError, data: promocodeCheck };
}