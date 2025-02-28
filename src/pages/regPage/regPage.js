import BasePage from "../basePage.js";
import Form from "../../../src/components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";

class RegPage extends BasePage {
    constructor() {
        super("regPage/regPage");
    }

    render(root, { showPage }) {
        root.innerHTML = super.render({});
        const mainElement = root.querySelector("main");
        const formElement = mainElement.querySelector(".reg_page__content__form");

        const form = new Form([
            {
                type: "text",
                id: "name",
                name: "Имя",
                defaultValue: "Леонид",
                errorMessage: "Введите реальную почту"
            },
            {
                type: "text",
                id: "surname",
                name: "Фамилия",
                defaultValue: "Круглов",
                errorMessage: "Слишком простой пароль"
            },
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

        const regButton = mainElement.querySelector(`button[name="signup"]`);
        regButton.addEventListener("click", () => {
            const validationResult = form.validate();
            if (validationResult) {
                alert(`Name: ${validationResult.name} ${validationResult.surname}\nEmail: ${validationResult.email}\nPassword: ${validationResult.password}`)
            }
        });
    }

    cleanUp() { }
}

export default RegPage;
