import TestPage from "./pages/testPage/testPage.js";

const root = document.getElementById("root");
const testPage = new TestPage({});
root.appendChild(testPage.render({ root: true }));

const pages = {
    "/": new TestPage(),
    "/test": new TestPage(),
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

showPage(window.location.pathname);