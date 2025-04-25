import Tarakan, { Reference } from "bazaar-tarakan";
import { ValidTypes } from "bazaar-validation";
import { AJAXErrors } from "../../api/errors";
import Button from "../../components/Button/Button";
import Form from "../../components/Form/Form";
import LogoIcon from "../../shared/images/LogoFull.svg";
import "./styles.scss";

class LoginPage extends Tarakan.Component {
    state: any = {
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
            <main className="login-page">
                <div className="login-page__content">
                    <div className="login-page__content__title">
                        <div>
                            <img className="login-page__content__title__icon" src={LogoIcon} alt="Логотип Базара" />
                            <div className="login-page__content__title__header">
                                <h1 className="login-page__content__title__header__h1">Вход</h1>
                                <div className="login-page__content__title__header__comment">
                                    Укажите данные для входа
                                </div>
                            </div>
                            <div className="login-page__content__title__input-comment">
                                {
                                    this.state.errorKey &&
                                    {
                                        "email": <div className="login-page__content__title__input-comment__error">
                                            Email является недействительным. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "password": <div className="login-page__content__title__input-comment__error">
                                            Не введён пароль. Пожалуста, повторите попытку ввода
                                        </div>,

                                        "wrongPassword": <div className="login-page__content__title__input-comment__error">
                                            Указан неверный пароль. Пожалуйста, повторите ввод.
                                        </div>,

                                        "serviceError": <div className="login-page__content__title__input-comment__error">
                                            Ошибка сервиса. Пожалуйста, повторите попытку позже.
                                        </div>,
                                    }[this.state.errorKey]

                                }
                                {
                                    (!this.state.errorKey && this.state.passwordHelp) && <div className="login-page__content__title__input-comment__help">
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
                        <Button className="login-page__content__title__redirect" title="Вернуться на главную страницу" variant="text" onClick={() => router.navigateTo("/")} />
                    </div>
                    <div className="login-page__content__form">
                        <Form
                            ref={this.state.formRef}
                            className="login-page__content__form__font-content"
                            form={[
                                {
                                    type: "email",
                                    id: "email",
                                    title: "Электронная почта",
                                    validType: ValidTypes.EmailValid,
                                },
                                {
                                    type: "password",
                                    id: "password",
                                    title: "Пароль",
                                    validType: ValidTypes.NotNullValid,
                                },
                            ]}
                            onEnd={(key: any) => this.setState({ errorKey: key })}
                        />
                        <div className="login-page__content__form__actions">
                            <Button title="Регистрация" variant="text" onClick={() => router.navigateTo("/signup")} />
                            <Button title="Войти" variant="primary" onClick={() => this.handleClickSignin()} />
                        </div>
                        <Button className="login-page__content__form__remember-me" title="Забыли пароль?" variant="text" />
                    </div>
                </div>
            </main>
            <footer />
        </div>
    }
}

export default LoginPage;