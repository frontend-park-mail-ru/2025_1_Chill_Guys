import LoginPage from "./pages/loginPage/loginPage.js";
import RegPage from "./pages/regPage/regPage.js";
import TestPage from "./pages/testPage/testPage.js";

const root = document.getElementById("root");
const page = new TestPage({});

root.appendChild(page.render({ root: true }))

/*const pages = {
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
    page.render(root, { showPage });
    activePageName = pageName;
}
*/
