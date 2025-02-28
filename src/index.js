import LoginPage from "./pages/loginPage/loginPage.js";
import RegPage from "./pages/regPage/regPage.js";

const root = document.getElementById("root");
const pages = {
    "login": new LoginPage(),
    "register": new RegPage(),
}

let activePageName = null;

function showPage(pageName) {
    if (activePageName) {
        pages[activePageName].cleanUp();
    }
    root.innerHTML = "";

    const page = pages[pageName];
    page.render(root, { showPage });
    activePageName = pageName;
}

showPage("login");
