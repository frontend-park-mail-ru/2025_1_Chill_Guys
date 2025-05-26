import { Store } from "bazaar-tarakan";
import { signIn, signUp } from "../api/auth";
import { AJAXErrors } from "../api/errors";
import { getMe } from "../api/user";
import { Nofitication, getNofitications, getNofiticationsCount, setVisibleNofitication } from "../api/nofitications";

const initValue = {};
const initAction = (store) => store.sendAction("me");

const UserStore = new Store(initValue, initAction);

UserStore.addAction("me", async (store) => {
    const res = await getMe();
    if (res.code === AJAXErrors.NoError) {
        store.sendAction("login", { ...store.value, login: true, ...res.data });
        store.sendAction("nofitications");
        setInterval(() => store.sendAction("nofitications_timer"), 10000);
    } else {
        store.sendAction("login", { login: false });
    }
    return res.code;
});

UserStore.addAction("logout", async (store) => {
    store.sendAction("login", { login: false });
});

UserStore.addAction("signin", async (store, data) => {
    const code = await signIn(data.email, data.password);
    if (code === AJAXErrors.NoError) {
        store.sendAction("me");
    }
    return code;
});

UserStore.addAction("signup", async (store, data) => {
    const code = await signUp(
        data.name,
        data.surname,
        data.email,
        data.password,
    );
    if (code === AJAXErrors.NoError) {
        store.sendAction("me");
    }
    return code;
});

UserStore.addAction("nofitications_timer", async (store) => {
    store.sendAction("nofitications");
    store.sendAction("nof_timer", store.value);
});

UserStore.addAction("nofitications", async (store) => {
    if (store.value.login) {
        const { code, data } = await getNofiticationsCount();
        if (code === AJAXErrors.NoError) {
            store.sendAction("nots_count", {
                ...store.value,
                unread_count: data
            });
        }
    }
});

UserStore.addAction("getNofitications", async (store) => {
    if (store.value.login) {
        const { code, data } = await getNofitications();
        if (code === AJAXErrors.NoError) {
            store.sendAction("nots_count", {
                ...store.value,
                unread_count: data.unread_count
            });
            store.sendAction("nots", {
                ...store.value,
                notifications: data.nots,
            });
        }
    }
});

UserStore.addAction("nextNofitications", async (store) => {
    if (store.value.login) {
        const { code, data } = await getNofitications(store.value.notifications.length);
        if (code === AJAXErrors.NoError) {
            store.sendAction("nots_count", {
                ...store.value,
                unread_count: data.unread_count
            });
            store.sendAction("nots", {
                ...store.value,
                notifications: [...store.value.notifications, ...data.nots],
            });
        }
    }
});

UserStore.addAction("setVisibleNofitication", async (store, id) => {
    if (store.value.login) {
        const code = await setVisibleNofitication(id);
        if (code === AJAXErrors.NoError) {
            store.sendAction("nots_count", {
                ...store.value,
                unread_count: store.value.unread_count - 1
            });
            store.sendAction("nots", {
                ...store.value,
                notifications: store.value.notifications.map((notification: Nofitication) =>
                    notification.id === id
                        ? { ...notification, isRead: true }
                        : notification
                ),
            });
        }
    }
});

export default UserStore;
