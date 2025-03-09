import BasePage from "../basePage.js";
import Button, { BUTTON_VARIANT } from "../../components/button/button.js";
import Form from "../../components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import TemplateComponent from "../../components/templateComponent/templateComponent.js";
import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";

class RegisterPage extends BasePage {
    constructor() {
        super("regPage/regPage");
    }

    /**
     * Состояние компоненты:
     * - invalidInput: словарь, хранящий информацию о том, какие поля имеют неправильный формат или значение
     * - showHelp: показывать ли подсказку по вводу пароля
     */
    state = {
        invalidInput: {},
        showHelp: false,
    }

    /**
     * Отправляет на сервер форму регистрации
     * @param {object} form Значения формы для регистрации
     */
    async handleSignup(form) {
        const data = {
            email: form.email,
            password: form.password,
            name: form.name,
            surname: form.surname,
        };

        const response = await ajax.post("api/auth/register", data, {
            origin: SERVER_URL,
        });

        if (response.result.status === 200) {
            this.showPage("/");
        } else if (response.result.status === 409) {
            this.children.form.markError("email", true, true);
            this.setState({
                invalidInput: {
                    ...this.state.invalidInput,
                    userExists: true,
                }
            });
        }
    }

    /**
     * Функция генерации страницы регистрации
     * @returns {HTMLElement}
     */
    render(context) {
        return super.renderElement(context, {}, {
            "form": new Form({
                otherClasses: "reg_page__form__content",
                onChange: (id) => {
                    if (id == "password" || id == "repeat_password") {
                        if (!this.state.invalidInput[id]) {
                            this.setState({
                                showHelp: true
                            });
                        }
                    }
                },
                onFinish: (id, isSuccess) => {
                    console.log(id, isSuccess)
                    this.setState({
                        invalidInput: {
                            ...this.state.invalidInput,
                            [id]: !isSuccess,
                            userExists: false,
                        },
                        showHelp: false
                    });
                },
            }, [
                { type: "text", id: "name", name: "Имя", validType: VALID_TYPES.NOT_NULL_VALID, defaultValue: "Леонид" },
                { type: "text", id: "surname", name: "Фамилия (необязательно)", defaultValue: "Круглов" },
                { type: "email", id: "email", name: "Электронная почта", validType: VALID_TYPES.EMAIL_VALID, defaultValue: "lenya@leshak.ru" },
                { type: "password", id: "password", name: "Пароль", validType: VALID_TYPES.PASSWORD_VALID, defaultValue: "1234Aaaa" },
                { type: "password", id: "repeatPassword", name: "Повторите пароль", validType: VALID_TYPES.PASSWORD_VALID, defaultValue: "1234Aaaa" },
            ]),
            "comment": new TemplateComponent({
                template: "regPage/comment",
                invalid: this.state.invalidInput,
                showHelp: this.state.showHelp,
            }),
            "redirectMainButton": new Button({
                title: "Вернуться на главную страницу",
                variant: BUTTON_VARIANT.TEXT,
                size: "l",
                otherClasses: "reg_page__title__redirect",
                onClick: () => context.showPage("/")
            }),
            "signinButton": new Button({
                title: "Войти",
                variant: BUTTON_VARIANT.TEXT,
                size: "l",
                onClick: () => context.showPage("/login")
            }),
            "signupButton": new Button({
                title: "Зарегистрироваться",
                variant: BUTTON_VARIANT.PRIMARY,
                size: "l",
                onClick: () => {
                    const dataValid = this.children.form.validate();
                    if (dataValid) {
                        if (dataValid.password != dataValid.repeatPassword) {
                            this.children.form.markError("password", true, true);
                            this.children.form.markError("repeatPassword", true, true);
                            this.setState({
                                invalidInput: {
                                    ...this.state.invalidInput,
                                    nowRepeated: true,
                                },
                            });
                            return;
                        }

                        this.children.form.markError("password", false, true);
                        this.children.form.markError("repeatPassword", false, true);
                        this.setState({
                            invalidInput: {
                                ...this.state.invalidInput,
                                nowRepeated: false,
                            },
                        });

                        this.handleSignup(dataValid);
                    }
                }
            }),
        })
    }
}

export default RegisterPage;