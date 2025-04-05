import Tarakan from "../modules/tarakan.js";
import CartPage from "./new_pages/CartPage/CartPage.jsx";
import IndexPage from "./new_pages/IndexPage/IndexPage.jsx";

import LoginPage from "./new_pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./new_pages/RegisterPage/RegisterPage.jsx";
import UserStore from "./stores/UserStore.js";

import "./styles/style.scss";

const root = document.getElementById("root");

// Создания приложения и настройка страниц
const app = new Tarakan.Application({
  "/": IndexPage,
  "/signup": RegisterPage,
  "/signin": LoginPage,
  "/cart": CartPage,
});

// Регистрация хранилищ глобального состояния
app.addStore("user", UserStore);

app.render(root);
