import RegisterPage from "./pages/regPage/regPage.js";
import TestPage from "./pages/testPage/testPage.js";

const root = document.getElementById("root");
const testPage = new TestPage({});
root.appendChild(testPage.render({ root: true }));

const pages = {
    "/": new TestPage(),
    "/login": new TestPage(),
    "/signup": new RegisterPage(),
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