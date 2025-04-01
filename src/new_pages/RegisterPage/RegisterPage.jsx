import Tarakan from "../../../modules/tarakan.js";
import { VALID_TYPES } from "../../../modules/validation.js";
import Button from "../../new_components/Button/Button.jsx";
import Form from "../../new_components/Form/Form.jsx";

import LogoIcon from "../../shared/images/LogoFull.svg";

import "./styles.scss";

class RegisterPage extends Tarakan.Component {

    state = {
        count: 0,
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
                        </div>
                        <Button className="redirect" title="Вернуться на главную страницу" variant="text" onClick={() => router.navigateTo("/")} />
                    </div>
                    <div className="form">
                        <Form className="font-content" form={[
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
                        ]} />
                        <div className="actions">
                            <Button title="Войти" variant="text" />
                            <Button title="Зарегистрироваться" variant="primary" />
                        </div>
                    </div>
                </div>
            </main>
            <footer />
        </div>
    }
}

export default RegisterPage;