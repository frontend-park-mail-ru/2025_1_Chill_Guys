import { Store } from "../../modules/tarakan.js";
import { signIn, signUp } from "../api/auth.ts";
import { AJAXErrors } from "../api/errors.ts";
import { getMe } from "../api/user.ts";

const initValue = {};
const initAction = (store) => store.sendAction("me");

const UserStore = new Store(initValue, initAction);

UserStore.addAction("me", async (store) => {
  const res = await getMe();
  if (res.code === AJAXErrors.NoError) {
    store.sendAction("login", { login: true, ...res.data });
  } else {
    store.sendAction("login", { login: false });
  }
  return res.code;
});

UserStore.addAction("signin", async (store, data) => {
  const code = await signIn(data.email, data.password);
  if (code === AJAXErrors.NoError) {
    store.sendAction("me");
  }
  return code;
});

UserStore.addAction("signup", async (store, data) => {
  const code = await signUp(data.name, data.surname, data.email, data.password);
  if (code === AJAXErrors.NoError) {
    store.sendAction("me");
  }
  return code;
});

export default UserStore;
