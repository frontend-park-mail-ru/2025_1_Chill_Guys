import ajax from "../modules/ajax.js";
import LoginPage from "./pages/loginPage/loginPage.js";
import RegPage from "./pages/regPage/regPage.js";
import TestPage from "./pages/testPage/testPage.js";

const root = document.getElementById("root");
const pages = {
    "login": new TestPage(),
    "register": new RegPage(),
}

let activePageName = null;

function showPage(pageName) {
    if (activePageName) {
        pages[activePageName].cleanUp();
    }
    root.innerHTML = "";

    const page = pages[pageName];
    root.appendChild(page.render({ showPage, root: true }));
    activePageName = pageName;
}

showPage("register");