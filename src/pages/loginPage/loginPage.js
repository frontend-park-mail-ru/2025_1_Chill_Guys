import BasePage from "../basePage.js";
import Form from "../../../src/components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";

class LoginPage extends BasePage {
    constructor() {
        super("loginPage/loginPage");
    }

    render(root, { showPage }) {
        root.innerHTML = super.render({});
        const mainElement = root.querySelector("main");
        const formElement = mainElement.querySelector(".login_page__content__form");

        const form = new Form([
            {
                type: "text",
                id: "email",
                name: "Электронная почта",
                defaultValue: "lenya@leshak.ru",
                validType: VALID_TYPES.EMAIL_VALID,
                errorMessage: "Введите реальную почту"
            },
            {
                type: "password",
                id: "password",
                name: "Пароль",
                defaultValue: "testPasswordSECRET2025",
                validType: VALID_TYPES.PASSWORD_VALID,
                errorMessage: "Слишком простой пароль"
            },
        ], []);
        formElement.appendChild(form.render());

        const loginButton = mainElement.querySelector(`button[name="signin"]`);
        loginButton.addEventListener("click", () => {
            const validationResult = form.validate();
            if (validationResult) {
                const rememberMe = mainElement.querySelector("#remember_me");
                alert(`Email: ${validationResult.email}\nPassword: ${validationResult.password}\n\nRemember: ${rememberMe.checked}`)
            }
        });

        const regButton = mainElement.querySelector(`button[name="signup"]`);
        regButton.addEventListener("click", () => {
            showPage("register")
        });
    }

    cleanUp() { }
}

export default LoginPage;