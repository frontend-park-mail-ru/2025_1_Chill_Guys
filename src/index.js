import Tarakan from "../modules/tarakan.js";

import IndexPage from "./new_pages/IndexPage/IndexPage.jsx";
import LoginPage from "./new_pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./new_pages/RegisterPage/RegisterPage.jsx";

import "./styles/style.scss";

const root = document.getElementById("root");
const router = new Tarakan.Router({
  "/": IndexPage,
  "/signup": RegisterPage,
  "/signin": LoginPage,
});
router.render(root);
