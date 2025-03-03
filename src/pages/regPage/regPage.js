import BasePage from "../basePage.js";
import Form from "../../../src/components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import Button from "../../components/button/button.js";

class RegPage extends BasePage {
    constructor() {
        super("regPage/regPage");
    }

    render(context) {
        return super.renderElement(context, {}, {
            "form": new Form({ otherClasses: "reg_page__content__form" }, [
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
            ]),
            "signupButton": new Button({
                type: "primary",
                title: "Зарегистрироваться на BAZAAR",
                onClick: () => {
                    const validationResult = form.validate();
                    if (validationResult) {
                        alert(`Name: ${validationResult.name} ${validationResult.surname}\nEmail: ${validationResult.email}\nPassword: ${validationResult.password}`)
                    }
                },
            })
        })
    }

    cleanUp() { }
}

export default RegPage;
