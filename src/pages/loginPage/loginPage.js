import BasePage from "../basePage.js";
import Button from "../../../src/components/button/button.js";

class LoginPage extends BasePage {
    constructor() {
        super("loginPage/loginPage");
    }

    render(root, props) {
        root.innerHTML = super.render({});
        const mainElement = root.querySelector("main");
        const buttonElement = new Button();

        mainElement.appendChild(buttonElement.render({
            type: "success",
            title: "Click me!",
        }));
    }

    cleanUp() { }
}

export default LoginPage;