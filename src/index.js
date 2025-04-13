import Tarakan from "../modules/tarakan.js";
import CartPage from "./pages/CartPage/CartPage.jsx";
import IndexPage from "./pages/IndexPage/IndexPage.jsx";

import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import PlaceOrderPage from "./pages/PlaceOrderPage/PlaceOrderPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import UserStore from "./stores/UserStore.js";

import "./styles/style.scss";

const root = document.getElementById("root");

// Создания приложения и настройка страниц
const app = new Tarakan.Application({
  "/": IndexPage,
  "/signup": RegisterPage,
  "/signin": LoginPage,
  "/cart": CartPage,
  "/place-order": PlaceOrderPage,
});

// Регистрация хранилищ глобального состояния
app.addStore("user", UserStore);

app.render(root);