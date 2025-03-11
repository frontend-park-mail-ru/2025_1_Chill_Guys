"use strict";

import LoginPage from "./pages/loginPage/loginPage.js";
import RegisterPage from "./pages/regPage/regPage.js";
import IndexPage from "./pages/indexPage/indexPage.js";

/**
 * Главный элемент страницы
 */
const root = document.getElementById("root");

/**
 * Словарь страниц
 */
const pages = {
  "/": new IndexPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
};

/**
 * Путь активной страницы
 */
let activePagePath = null;

/**
 * Переход на новую страницу
 * @param {String} pagePath Путь страницы
 */
function showPage(pagePath) {
  if (activePagePath) {
    pages[activePagePath].cleanUp();
  }
  root.innerHTML = "";

  const page = pages[pagePath];
  root.appendChild(page.render({ showPage, root: true }));

  history.pushState(null, "", pagePath);
  activePagePath = pagePath;
}

window.addEventListener("popstate", () => showPage(window.location.pathname));
window.addEventListener("pushstate", () => showPage(window.location.pathname));

showPage(window.location.pathname);
