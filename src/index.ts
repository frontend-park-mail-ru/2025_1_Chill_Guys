import Tarakan from "bazaar-tarakan";
import CartPage from "./pages/CartPage/CartPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PlaceOrderPage from "./pages/PlaceOrderPage/PlaceOrderPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import UserStore from "./stores/UserStore";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import SurveyPage from "./pages/SurveyPage/SurveyPage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import CSATStore from "./stores/CSATStore";
import AdminPage from "./pages/AdminPage/AdminPage";

import ProductsStore from "./stores/ProductsStore";

import "./styles/style.scss";

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
  "/csat/<id>": SurveyPage,
  "/admin/<tab>": AdminPage,
});

// Регистрация хранилищ глобального состояния
app.addStore("user", UserStore);
app.addStore("products", ProductsStore);
app.addStore("csat", CSATStore);

// SW
async function setupSW() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
}

setupSW();
app.render(root);
