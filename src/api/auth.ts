import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export async function signIn(email: string, password: string): Promise<AJAXErrors> {
    const response = await ajax.post("auth/login", { email, password });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 400 || response.result.status == 401) {
        return AJAXErrors.NoUser;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function signUp(name: string, surname: string, email: string, password: string): Promise<AJAXErrors> {
    const response = await ajax.post("auth/register", { name, surname, email, password });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 409) {
        return AJAXErrors.UserAlreadyExists;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function logout(name: string, surname: string, email: string, password: string): Promise<AJAXErrors> {
    const response = await ajax.post("auth/logout", {});

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