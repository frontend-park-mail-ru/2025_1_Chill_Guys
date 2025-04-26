import { Store } from "bazaar-tarakan";
import { signIn, signUp } from "../api/auth";
import { AJAXErrors } from "../api/errors";
import { getMe } from "../api/user";

const initValue = {};
const initAction = (store) => { };

const CSATStore = new Store(initValue, initAction);

export default CSATStore;
