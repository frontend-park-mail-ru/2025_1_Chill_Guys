import Tarakan from "../modules/tarakan.js";

import IndexPage from "./new_pages/IndexPage/IndexPage.jsx";
import RegisterPage from "./new_pages/RegisterPage/RegisterPage.jsx";

import "./styles/style.scss";

const root = document.getElementById("root");
const router = new Tarakan.Router({
	"/": IndexPage,
	"/reg": RegisterPage,
});
router.render(root);