import Tarakan from "../modules/tarakan.js";
import CartPage from "./new_pages/CartPage/CartPage.jsx";

import LoginPage from "./new_pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./new_pages/RegisterPage/RegisterPage.jsx";

import "./styles/style.scss";

const root = document.getElementById("root");
const router = new Tarakan.Router({
  "/": CartPage,
  "/signup": RegisterPage,
  "/signin": LoginPage,
  "/cart": CartPage,
});
router.render(root);
