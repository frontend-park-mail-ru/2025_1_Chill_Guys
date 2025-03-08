import BasePage from "../basePage.js";
import Button, { BUTTON_VARIANT } from "../../components/button/button.js";
import Form from "../../components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import TemplateComponent from "../../components/templateComponent/templateComponent.js";
import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";

class LoginPage extends BasePage {
    constructor() {
        super("loginPage/loginPage");
    }

    state = {
        error: "",
    }

    async handleSignin(form) {
        const data = {
            email: form.email,
            password: form.password,
            rememberMe: form.rememberMe,
        };

        const response = await ajax.post("api/auth/login", data, { origin: SERVER_URL });

        if (response.result.status === 400) {
            this.children.form.markError("password", true, true);
            this.setState({ error: "Пароль должен содержать как минимум 8 символов. Пожалуйста, повторите ввод." })
        } else if (response.result.status === 401) {
            this.children.form.markError("password", true, true);
            this.setState({ error: "Указан неверный пароль. Пожалуйста, повторите ввод." })
        } else {
            this.showPage("/");
        }
    }

    render(context) {
        return super.renderElement(context, {}, {
            "form": new Form({
                otherClasses: "login_page__form__content",
                onChange: () => {
                    this.setState({ error: "" });
                },
                onFinish: (id, isSuccess) => {
                    if (!isSuccess) {
                        if (id === "email") {
                            this.setState({ error: "Введите действительный адрес почты. Пожалуйста, повторите ввод." })
                        } else {
                            this.setState({ error: "Пароль должен содержать как минимум 8 символов. Пожалуйста, повторите ввод." })
                        }
                    }
                },
            }, [
                { type: "email", id: "email", name: "Электронная почта", validType: VALID_TYPES.EMAIL_VALID, defaultValue: "lenya@leshak.ru" },
                { type: "password", id: "password", name: "Пароль", validType: VALID_TYPES.NOT_NULL_VALID, defaultValue: "1234Aaaa" },
            ]),
            "redirectMainButton": new Button({
                title: "Вернуться на главную страницу",
                variant: BUTTON_VARIANT.TEXT,
                size: "l",
                otherClasses: "login_page__title__redirect",
                onClick: () => context.showPage("/")
            }),
            "comment": new TemplateComponent({
                template: "loginPage/comment",
                error: this.state.error
            }),
            "rememberMeButton": new Button({
                title: "Забыли пароль?",
                variant: BUTTON_VARIANT.TEXT,
                size: "l",
                otherClasses: "login_page__form__rememberMeButton",
                onClick: () => context.showPage("/login")
            }),
            "signupButton": new Button({
                title: "Регистрация",
                variant: BUTTON_VARIANT.TEXT,
                size: "l",
                onClick: () => context.showPage("/register")
            }),
            "signinButton": new Button({
                title: "Войти",
                variant: BUTTON_VARIANT.PRIMARY,
                size: "l",
                onClick: () => {
                    const dataValid = this.children.form.validate();
                    const element = this.getElement();

                    dataValid["rememberMe"] = element.querySelector("#rememberMe").checked;

                    console.log(dataValid);

                    if (dataValid) {
                        this.handleSignin(dataValid);
                    }
                }
            }),
        })
    }
}

export default LoginPage;