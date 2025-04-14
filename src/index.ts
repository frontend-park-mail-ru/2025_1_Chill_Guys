import Tarakan from "bazaar-tarakan";
import CartPage from "./pages/CartPage/CartPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";

import LoginPage from "./pages/LoginPage/LoginPage";
import PlaceOrderPage from "./pages/PlaceOrderPage/PlaceOrderPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import UserStore from "./stores/UserStore";

import "./styles/style.scss";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";

const root = document.getElementById("root");

// Создания приложения и настройка страниц
const app = new Tarakan.Application({
  "/": IndexPage,
  "/signup": RegisterPage,
  "/signin": LoginPage,
  "/cart": CartPage,
  "/orders": OrdersPage,
  "/place-order": PlaceOrderPage,
  "/profile": ProfilePage,
  "/category/<id>": CategoryPage,
});

// Регистрация хранилищ глобального состояния
app.addStore("user", UserStore);

app.render(root);
