import BasePage from "../basePage.js";
import Button from "../../../src/components/button/button.js";
import Form from "../../../src/components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";

class LoginPage extends BasePage {
    constructor() {
        super("loginPage/loginPage");
    }

    render(root, props) {
        root.innerHTML = super.render({});
        const mainElement = root.querySelector("main");
        const formElement = mainElement.querySelector(".login_page__content__form");

        const loginForm = new Form([
            {
                type: "text",
                id: "email",
                name: "Почта",
                validType: VALID_TYPES.EMAIL_VALID,
                errorMessage: "Введите реальную почту"
            },
            {
                type: "password",
                id: "password",
                name: "Пароль",
                validType: VALID_TYPES.PASSWORD_VALID,
                errorMessage: "Слишком простой пароль"
            },
        ], []);

        formElement.appendChild(loginForm.render());
    }

    cleanUp() { }
}

export default LoginPage;