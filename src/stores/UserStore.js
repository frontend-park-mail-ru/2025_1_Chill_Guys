import ajax from "../../modules/ajax.js";
import { Store } from "../../modules/tarakan.js";
import { SERVER_URL } from "../settings.js";

const initValue = { login: false };
const initAction = (store) => store.sendAction("me");

const UserStore = new Store(initValue, initAction);

UserStore.addAction("me", async (store) => {
    const res = await ajax.get("api/users/me", { origin: SERVER_URL });
    if (!res.error && res.result.ok) {
        const userData = await res.result.json();
        store.sendAction("login", { login: true, ...userData });
        return false;
    }
    return res.error || res.result.status;
});

UserStore.addAction("signin", async (store, data) => {
    const res = await ajax.post("api/auth/login", data, { origin: SERVER_URL });
    if (!res.error && res.result.ok) {
        store.sendAction("me");
        console.log(res)
        return false;
    }
    return res.error || res.result.status;
});

UserStore.addAction("signup", async (store, data) => {
    const res = await ajax.post("api/auth/register", data, {
        origin: SERVER_URL,
    });
    if (!res.error && res.result.ok) {
        store.sendAction("me");
        return false;
    }
    return res.error || res.result.status;
});

export default UserStore;
