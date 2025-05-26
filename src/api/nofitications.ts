import ajax, { AJAXRequestContentType } from "bazaar-ajax";
import { AJAXErrors } from "./errors";

export interface Nofitication {
    id: string;
    title: string;
    text: string;
    isRead: boolean;
    updatedAt: string;
}

export async function getNofiticationsCount(): Promise<{ code: AJAXErrors; data?: number }> {
    const response = await ajax.get("notification/count");

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
    return { code: AJAXErrors.NoError, data: rawData.unread_count };
}

export async function getNofitications(offset: number = 0): Promise<{ code: AJAXErrors; data?: { unread_count: number, nots: Nofitication[] } }> {
    const response = await ajax.get("notification/" + offset);

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
    const nots: Nofitication[] = rawData.notifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        text: notification.text,
        isRead: notification.is_read,
        updatedAt: notification.updated_at
    }));
    return {
        code: AJAXErrors.NoError,
        data: {
            unread_count: rawData.unread_count,
            nots: nots
        }
    };
}

export async function setVisibleNofitication(notificationId: string): Promise<AJAXErrors> {
    const response = await ajax.patch("notification/" + notificationId, {});

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