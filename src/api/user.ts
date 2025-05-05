import ajax, { AJAXRequestContentType } from "bazaar-ajax";
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
    const response = await ajax.get("users/me", { setCSRF: true });

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

export async function updateMe(name: string, surname: string, phoneNumber: string): Promise<AJAXErrors> {
    const response = await ajax.post("users/update-profile", {
        name, surname, phoneNumber
    });

    if (response.error || !response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<AJAXErrors> {
    const response = await ajax.post("users/update-password", {
        NewPassword: newPassword,
        oldPassword: oldPassword,
    });

    if (response.error) {
        return AJAXErrors.ServerError;
    }

    if (response.result.status == 401) {
        return AJAXErrors.WrongPassword;
    }

    if (!response.result.ok) {
        return AJAXErrors.ServerError;
    }

    return AJAXErrors.NoError;
}

export async function uploadAvatar(avatarFile: any): Promise<{ code: AJAXErrors, url?: string }> {
    const form = new FormData();
    form.append("file", avatarFile);
    const response = await ajax.post("users/upload-avatar", form, { type: AJAXRequestContentType.FORM });

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
    return { code: AJAXErrors.NoError, url: rawData.imageURL };
}