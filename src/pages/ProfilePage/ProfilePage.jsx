import Tarakan from "../../../modules/tarakan.js";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import "./styles.scss";
import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";

import ProfilePicture from "../../shared/images/header-profile-ico.svg";
import Button from "../../components/Button/Button.jsx";
import TextField from "../../components/TextField/TextField.jsx";

export default class ProfilePage extends Tarakan.Component {
    state = {}

    init(props) {
        this.fetchProfileInfo();
    }

    getFullName() {
        if (this.state.name) {
            if (this.state.surname) {
                return `${this.state.name} ${this.state.surname}`;
            }
            return `${this.state.name}`;
        }
        return `Анонимный пользователь`;
    }

    showTab(e, tabID) {
        const elements = document.querySelectorAll(".tab");
        elements.forEach((item) => {
            item.classList.remove("active");
            if (item.id === tabID) {
                item.classList.add("active");
            }
        });

        const menuItems = document.querySelectorAll(".menu-item");
        menuItems.forEach((item) => {
            item.classList.remove("active");
        })
        e.target.classList.add("active");
    }

    async fetchProfileInfo() {
        const response = await ajax.get('api/users/me', { origin: SERVER_URL });

        if (!response.error) {
            const data = await response.result.json();
            this.setState({
                name: data.name,
                surname: data.surname,
                avatarURL: data.imageURL,
                email: data.email,
                phone_number: data.phoneNumber,
            });
        }
    }

    render(props, router) {
        return <div className={`container`}>
            <Header />

            <main className={`profile-page flex`}>
                <div className={`nav-column flex column`}>
                    <img
                        className={`avatar`}
                        src={this.state.avatarURL ? this.state.avatarURL : `${ProfilePicture}`}
                        alt={`Аватар пользователя`}
                    />

                    <h2 className={`h-reset name`}>{this.getFullName()}</h2>

                    <ol className={`list-reset menu flex column`}>
                        <li
                            className={`menu-item active`}
                            onClick={(e) => this.showTab(e, 'personal-data')}
                        >
                            Мои данные
                        </li>
                        <li
                            className={`menu-item`}
                            onClick={(e) => this.showTab(e, 'my-orders')}
                        >
                            Мои заказы
                        </li>
                        <li
                            className={`menu-item`}
                            onClick={(e) => this.showTab(e, 'my-reviews')}
                        >
                            Мои отзывы
                        </li>
                        <li
                            className={`menu-item`}
                            onClick={(e) => this.showTab(e, 'my-saved')}
                        >
                            Моё избранное
                        </li>
                    </ol>
                </div>

                <div id='personal-data' className={`tab active`}>
                    <div>
                        <h2 className={`h-reset header`}>Мои данные</h2>
                        <p className={`help`}>
                            Здесь Вы можете изменить свои персональные данные. Они будут использоваться при создании заказа.
                        </p>
                    </div>

                    <div className={`main-content flex column`}>
                        <div className={`fields-wrapper`}>
                            <div className={`fields-column`}>
                                <TextField
                                    fieldName='Имя'
                                    isDisabled={true}
                                    value={`${this.state.name}`}
                                />

                                <TextField
                                    fieldName='Фамилия'
                                    isDisabled={true}
                                    value={`${this.state.surname}`}
                                />
                                <TextField
                                    fieldName='Почта'
                                    isDisabled={true}
                                    value={`${this.state.email}`}
                                />
                            </div>

                            <div className={`fields-column`}>
                                <TextField
                                    fieldName='Старый пароль'
                                    isDisabled={true}
                                    title={'***********'}
                                />

                                <TextField
                                    fieldName='Новый пароль'
                                    isDisabled={true}
                                />
                                <TextField
                                    fieldName='Новый пароль ещё раз'
                                    isDisabled={true}
                                />
                            </div>
                        </div>

                        <div className={`button-wrapper`}>
                            <Button
                                className={`save inactive`}
                                title={'Сохранить'}
                            />
                        </div>
                    </div>

                </div>

                <div id='my-reviews' className={`tab`}>
                    <h2 className={`h-reset header`}>Мои отзывы</h2>
                    <p className={`help`}>Здесь будет отображаться список Ваших отзывов</p>
                    <div></div>
                </div>

                <div id='my-saved' className={`tab`}>
                    <h2 className={`h-reset header`}>Мои сохраненные</h2>
                    <p className={`help`}>Здесь будет отображаться список Ваших сохраненных товаров</p>
                    <div></div>
                </div>

                <div id='my-orders' className={`tab`}>
                    <h2 className={`h-reset header`}>Мои заказы</h2>
                    <p className={`help`}>Здесь будет отображаться список Ваших заказов</p>
                    <div></div>
                </div>
            </main>

            <Footer />
        </div>
    }
}
