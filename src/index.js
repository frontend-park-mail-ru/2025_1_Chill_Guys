import LoginPage from "./pages/loginPage/loginPage.js";

const root = document.getElementById("root");
const pages = {
    "login": new LoginPage(),
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