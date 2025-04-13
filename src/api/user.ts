import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface UserData {
    id: string,
    email: string,
    name: string,
    surname: string,
    imageURL: string,
    phoneNumber: string,
}

export async function getMe(): Promise<{ code: AJAXErrors, data?: UserData }> {
    const response = await ajax.get("users/me");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    return { code: AJAXErrors.NoError, data: await response.result.json() };
}

