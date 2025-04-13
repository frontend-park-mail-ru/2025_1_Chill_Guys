import ajax from "../../../modules/ajax.js";
import Tarakan, { Reference } from "../../../modules/tarakan.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import { AJAXErrors } from "../../api/errors.ts";
import Button from "../../components/Button/Button.jsx";
import Form from "../../components/Form/Form.jsx";
import { SERVER_URL } from "../../settings.js";

import LogoIcon from "../../shared/images/LogoFull.svg";

import "./styles.scss";

class RegisterPage extends Tarakan.Component {
    state = {
        errorKey: "",
        passwordHelp: false,
        formRef: new Reference(),
    }

    handleFieldFocus(field) {
        if (field === "password" || field === "repeatPassword") {
            this.setState({ passwordHelp: true });
        }
    }

    async handleClickSignup() {
        const validationResult = this.state.formRef.target.validate();
        if (validationResult) {
            if (validationResult.password != validationResult.repeatPassword) {
                this.state.formRef.target.setFieldStatus("password", true);
                this.state.formRef.target.setFieldStatus("repeatPassword", true);
                this.setState({ errorKey: "notRepeated" });
                return;
            }

            const error = await this.app.store.user.sendAction("signup", {
                email: validationResult.email,
                password: validationResult.password,
                name: validationResult.name,
                surname: validationResult.surname,
            });

            if (error === AJAXErrors.NoError) {
                this.app.navigateTo("/");
            } else if (error === AJAXErrors.UserAlreadyExists) {
                this.state.formRef.target.setFieldStatus("email", true);
                this.setState({ errorKey: "userExists" });
            }
        }
    }

    render(props, router) {
        return <div>
            <header />
            <main className="reg_page">
                <div className="content">
                    <div className="title">
                        <div>
                            <img className="icon" src={LogoIcon} />
                            <div className="header">
                                <h1 className="h1">Регистрация</h1>
                                <div className="comment">Заполните основную информацию о себе</div>
                            </div>
                            <div className="input-comment">
                                {
                                    this.state.errorKey &&
                                    {
                                        "name": <div className="error">
                                            Введите ваше имя с заглавной буквы. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "email": <div className="error">
                                            Email является недействительным. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "password": <div className="error">
                                            Формат пароля не верный. Пожалуйста учтите требования к паролю:
                                            <ul>
                                                <li>длина от 8 до 24 символов</li>
                                                <li>хотя бы 1 заглавная и прописная буква латинского алфавита</li>
                                                <li>хотя бы 1 цифра</li>
                                            </ul>
                                        </div>,

                                        "repeatPassword": <div className="error">
                                            Формат пароля не верный. Пожалуйста учтите требования к паролю:
                                            <ul>
                                                <li>длина от 8 до 24 символов</li>
                                                <li>хотя бы 1 заглавная и прописная буква латинского алфавита</li>
                                                <li>хотя бы 1 цифра</li>
                                            </ul>
                                        </div>,

                                        "notRepeated": <div className="error">
                                            Пароли не совпдают. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "userExists": <div className="error">
                                            Данная почта уже зарегистрирована. Пожалуста, повторите попытку ввода
                                        </div>,
                                    }[this.state.errorKey]
                                }
                                {
                                    (!this.state.errorKey && this.state.passwordHelp) && <div className="help">
                                        Формат пароля не верный. Пожалуйста учтите требования к паролю:
                                        <ul>
                                            <li>длина от 8 до 24 символов</li>
                                            <li>хотя бы 1 заглавная и прописная буква латинского алфавита</li>
                                            <li>хотя бы 1 цифра</li>
                                        </ul>
                                    </div>
                                }
                            </div>
                        </div>
                        <Button className="redirect" title="Вернуться на главную страницу" variant="text" onClick={() => router.navigateTo("/")} />
                    </div>
                    <div className="form">
                        <Form
                            ref={this.state.formRef}
                            className="font-content"
                            form={[
                                {
                                    type: "text",
                                    id: "name",
                                    title: "Имя",
                                    validType: VALID_TYPES.NAME_VALID,
                                },
                                {
                                    type: "text",
                                    id: "surname",
                                    title: "Фамилия (необязательно)",
                                },
                                {
                                    type: "email",
                                    id: "email",
                                    title: "Электронная почта",
                                    validType: VALID_TYPES.EMAIL_VALID,
                                },
                                {
                                    type: "password",
                                    id: "password",
                                    title: "Пароль",
                                    validType: VALID_TYPES.PASSWORD_VALID,
                                },
                                {
                                    type: "password",
                                    id: "repeatPassword",
                                    title: "Повторите пароль",
                                    validType: VALID_TYPES.PASSWORD_VALID,
                                },
                            ]}
                            onFieldFocus={(field) => this.handleFieldFocus(field)}
                            onEnd={(key) => this.setState({ errorKey: key, passwordHelp: false })}
                        />
                        <div className="actions">
                            <Button title="Войти" variant="text" onClick={() => router.navigateTo("/signin")} />
                            <Button title="Зарегистрироваться" variant="primary" onClick={() => this.handleClickSignup()} />
                        </div>
                    </div>
                </div>
            </main>
            <footer />
        </div>
    }
}

export default RegisterPage;