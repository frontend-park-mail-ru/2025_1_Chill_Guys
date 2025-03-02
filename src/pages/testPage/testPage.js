import BasePage from "../basePage.js";
import Button from "../../components/button/button.js";
import TextField from "../../components/textField/textField.js";
import Form from "../../components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";

class TestPage extends BasePage {
    constructor(props) {
        super("testPage/testPage", props);
    }

    render(context) {
        return super.renderElement(context, {}, {
            "form": new Form([
                {
                    type: "text",
                    id: "email",
                    name: "Электронная почта",
                    defaultValue: "lenya@leshak.r",
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
            "signinButton": new Button({
                type: "primary",
                title: "Войти",
                onClick: () => {
                    this.children["form"].validate();
                }
            })
        })
    }
}

export default TestPage;