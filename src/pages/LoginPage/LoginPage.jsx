import ajax from "../../../modules/ajax.js";
import Tarakan, { Reference } from "../../../modules/tarakan.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import { AJAXErrors } from "../../api/errors.ts";
import Button from "../../components/Button/Button.jsx";
import Form from "../../components/Form/Form.jsx";
import { SERVER_URL } from "../../settings.js";

import LogoIcon from "../../shared/images/LogoFull.svg";

import "./styles.scss";

class LoginPage extends Tarakan.Component {
    state = {
        errorKey: "",
        formRef: new Reference(),
    }

    async handleClickSignin() {
        const validationResult = this.state.formRef.target.validate();
        if (validationResult) {
            const error = await this.app.store.user.sendAction("signin", {
                email: validationResult.email,
                password: validationResult.password,
            });

            console.log(error);

            if (error === AJAXErrors.NoError) {
                this.app.navigateTo("/");
            } else if (error === AJAXErrors.NoUser) {
                this.state.formRef.target.setFieldStatus("password", true);
                this.setState({ errorKey: "wrongPassword" });
            } else if (error === AJAXErrors.ServerError) {
                this.setState({ errorKey: "serviceError" });
            }
        }
    }

    render(props, router) {
        return <div>
            <header />
            <main className="login_page">
                <div className="content">
                    <div className="title">
                        <div>
                            <img className="icon" src={LogoIcon} />
                            <div className="header">
                                <h1 className="h1">Вход</h1>
                                <div className="comment">Укажите данные для входа</div>
                            </div>
                            <div className="input-comment">
                                {
                                    this.state.errorKey &&
                                    {
                                        "email": <div className="error">
                                            Email является недействительным. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "password": <div className="error">
                                            Пароль должен содержать как минимум 8 символов. Пожалуйста, повторите ввод.
                                        </div>,

                                        "wrongPassword": <div className="error">
                                            Указан неверный пароль. Пожалуйста, повторите ввод.
                                        </div>,

                                        "serviceError": <div className="error">
                                            Ошибка сервиса. Пожалуйста, повторите попытку позже.
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
                                    type: "email",
                                    id: "email",
                                    title: "Электронная почта",
                                    defaultValue: "leon@leshak.ru",
                                    validType: VALID_TYPES.EMAIL_VALID,
                                },
                                {
                                    type: "password",
                                    id: "password",
                                    title: "Пароль",
                                    defaultValue: "1234QWERTYa",
                                    validType: VALID_TYPES.PASSWORD_VALID,
                                },
                            ]}
                            onEnd={(key) => this.setState({ errorKey: key })}
                        />
                        <div className="actions">
                            <Button title="Регистрация" variant="text" onClick={() => router.navigateTo("/signup")} />
                            <Button title="Войти" variant="primary" onClick={() => this.handleClickSignin()} />
                        </div>
                        <Button className="remember-me" title="Забыли пароль?" variant="text" />
                    </div>
                </div>
            </main>
            <footer />
        </div>
    }
}

export default LoginPage;