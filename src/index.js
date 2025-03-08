import LoginPage from "./pages/loginPage/loginPage.js";
import RegisterPage from "./pages/regPage/regPage.js";
import IndexPage from "./pages/indexPage/indexPage.js";

const root = document.getElementById("root");

const pages = {
    "/": new IndexPage(),
    "/login": new LoginPage(),
    "/register": new RegisterPage(),
}

let activePageName = null;
function showPage(pageName) {
    if (activePageName) {
        pages[activePageName].cleanUp();
    }
    root.innerHTML = "";

    const page = pages[pageName];
    root.appendChild(page.render({ showPage, root: true }));

    history.pushState(null, "", pageName)
    activePageName = pageName;
}

window.addEventListener("popstate", () => showPage(window.location.pathname));
window.addEventListener("pushstate", () => showPage(window.location.pathname));

showPage(window.location.pathname);