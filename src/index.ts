import Tarakan from "bazaar-tarakan";
import CartPage from "./pages/CartPage/CartPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PlaceOrderPage from "./pages/PlaceOrderPage/PlaceOrderPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import SurveyPage from "./pages/SurveyPage/SurveyPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";

import AdminPage from "./pages/AdminPage/AdminPage";
import SellerFormPage from "./pages/SellerFormPage/SellerFormPage";

import CSATStore from "./stores/CSATStore";
import ProductsStore from "./stores/ProductsStore";
import UserStore from "./stores/UserStore";

import "./styles/style.scss";
import SellerPage from "./pages/SellerPage/SellerPage";
import NofiticationsPage from "./pages/NotificationsPage/NotificationsPage";
import WarehousePage from "./pages/WarehousePage/WarehousePage";

const root = document.getElementById("root");

// Создания приложения и настройка страниц
const app = new Tarakan.Application({
    "/": IndexPage,
    "/product/<productId>": ProductPage,
    "/signup": RegisterPage,
    "/signin": LoginPage,
    "/cart": CartPage,
    "/orders": OrdersPage,
    "/place-order": PlaceOrderPage,
    "/profile": ProfilePage,
    "/category/<id>": CategoryPage,
    "/search": SearchPage,
    "/stats": StatisticsPage,
    "/seller-form": SellerFormPage,
    "/csat/<id>": SurveyPage,
    "/notifications": NofiticationsPage,

    "/admin/<tab>": AdminPage,
    "/seller": SellerPage,
    "/warehouse": WarehousePage,
});

// Регистрация хранилищ глобального состояния
app.addStore("user", UserStore);
app.addStore("products", ProductsStore);
app.addStore("csat", CSATStore);

// SW
async function setupSW() {
    if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    }
}

setupSW();
app.render(root);
