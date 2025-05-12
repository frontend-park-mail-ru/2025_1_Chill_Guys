import ajax from "bazaar-ajax";
import { AJAXErrors } from "./errors";

interface UserAddress {
    id: string;
    label: string;
    addressString: string;
    coordinate: string;
}

export async function getUserAddresses(): Promise<{
    code: AJAXErrors;
    addresses?: UserAddress[];
}> {
    const response = await ajax.get("addresses");

    if (response.error) {
        return { code: AJAXErrors.ServerError };
    }

    if (response.result.status == 401) {
        return { code: AJAXErrors.Unauthorized };
    }

    if (!response.result.ok) {
        return { code: AJAXErrors.ServerError };
    }

    const addressesRaw = await response.result.json();
    const addresses: UserAddress[] = addressesRaw.addresses.map(
        (address: any) => ({
            id: address.id,
            label: address.label,
            addressString: address.addressString ?? address.AddressString,
            coordinate: address.coordinate,
        }),
    );

    return { code: AJAXErrors.NoError, addresses: addresses };
}

export async function saveAddress(
    region: string,
    city: string,
    addressString: string,
    coordinate: string,
    label: string,
): Promise<AJAXErrors> {
    const response = await ajax.post("addresses", {
        region,
        city,
        addressString,
        coordinate,
        label,
    });

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
