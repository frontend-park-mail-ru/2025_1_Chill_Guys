import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";

import ProfilePicture from "../../shared/images/header-profile-ico.svg";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import { getMe, updateMe, updatePassword, uploadAvatar } from "../../api/user";
import { AJAXErrors } from "../../api/errors";
import { ValidTypes } from "bazaar-validation";
import { logout } from "../../api/auth";
import CSAT from "../CSAT/CSAT";

export default class ProfilePage extends Tarakan.Component {
    state: any = {
        errors: {},
        oldPassword: "",
        password: "",
        repeatPassword: "",
        successData: false,
        successPassword: false,
        csat: false,
    }

    init(props) {
        this.fetchProfileInfo();
        // setTimeout => this.setState({ csat: true }), 10000);
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
        const response = await getMe();

        if (response.code === AJAXErrors.NoError) {
            this.setState({
                name: response.data.name,
                surname: response.data.surname ?? "",
                avatarURL: response.data.imageURL ?? "",
                email: response.data.email,
                phoneNumber: response.data.phoneNumber ?? "",
            });
        } else {
            this.app.navigateTo("/signin");
        }
    }

    handleChange(key: any, ok: any, v: any) {
        if (key === "phoneNumber" && v === "") {
            return;
        }

        if (ok) {
            if (this.state.errors[key]) {
                delete this.state.errors[key];
            }
        } else {
            this.setState({ errors: { ...this.state.errors, [key]: true } });
        }
        this.setState({
            [key]: v,
            successData: false,
            successPassword: false
        });
    }

    async handleSaveData() {
        const code = await updateMe(this.state.name, this.state.surname, this.state.phoneNumber);
        if (code === AJAXErrors.NoError) {
            this.setState({ successData: true });
        }
    }

    async handleSavePassword() {
        if (this.state.errors.notRepeatPassword) delete this.state.errors.notRepeatPassword;
        if (this.state.errors.wrongPassword) delete this.state.errors.wrongPassword;

        if (this.state.password != this.state.repeatPassword) {
            this.setState({ errors: { ...this.state.errors, notRepeatPassword: true } });
            return;
        }

        const code = await updatePassword(this.state.oldPassword, this.state.password);
        if (code === AJAXErrors.WrongPassword) {
            this.setState({ errors: { ...this.state.errors, wrongPassword: true } });
        }

        if (code === AJAXErrors.NoError) {
            this.setState({ successPassword: true, wrongPassword: true });
        }
    }

    async handleLogout() {
        const code = await logout();
        if (code === AJAXErrors.NoError) {
            this.app.store.user.sendAction("logout");
            this.app.navigateTo("/");
        }
    }

    async handleUploadAvatar(event: any) {
        const file = event.target.files[0];
        const response = await uploadAvatar(file);
        if (response.code === AJAXErrors.NoError) {
            this.setState({ avatarURL: response.url })
        }
    }

    render() {
        return <div className={`container`}>
            <Header />

            <main className={`profile-page flex`}>
                {this.state.csat && <CSAT id="Profile" />}
                <div className={`nav-column flex column`}>
                    <img
                        className={`avatar`}
                        src={this.state.avatarURL ? this.state.avatarURL : `${ProfilePicture}`}
                        alt={`Аватар пользователя`}
                    />

                    {/*<button type="button" className="avatar">
                        <label for="file">
                            <img
                                className={`avatar__img`}
                                src={this.state.avatarURL ? this.state.avatarURL : `${ProfilePicture}`}
                                alt={`Аватар пользователя`}
                            />
                        </label>
                    </button>
                    <input type="file" id="file" style="display:none;" />*/}

                    <h2 className={`h-reset name`}>{this.getFullName()}</h2>

                    <ol className={`list-reset menu flex column`}>
                        <li
                            className={`menu-item active`}
                            onClick={(e: any) => this.showTab(e, 'personal-data')}
                        >
                            Мои данные
                        </li>
                        <li className={`menu-item active`}>
                            <label style="cursor:pointer">
                                <input type="file" accept=".jpg,.png" style="display:none" onChange={(ev) => this.handleUploadAvatar(ev)} />
                                Сменить аватарку
                            </label>
                        </li>

                        <li
                            className={`menu-item error active`}
                            onClick={(e: any) => this.handleLogout()}
                        >
                            Выйти из профиля
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
                                    value={`${this.state.name}`}
                                    onEnd={(ok, v) => this.handleChange("name", ok, v)}
                                    validType={ValidTypes.NameValid}
                                    maxLength={"20"}
                                />

                                <TextField
                                    fieldName='Фамилия'
                                    value={`${this.state.surname}`}
                                    onEnd={(ok: any, v: any) => this.handleChange("surname", ok, v)}
                                    validType={ValidTypes.SurnameValid}
                                    maxLength={20}
                                />

                                <TextField
                                    fieldName='Телефон'
                                    value={`${this.state.phoneNumber ?? ""}`}
                                    disabled={"disabled"}
                                    onEnd={(ok: any, v: any) => this.handleChange("phoneNumber", ok, v)}
                                    validType={ValidTypes.TelephoneValid}
                                    title="Введите номер телефона"
                                    maxLength={20}
                                />
                                <div style="display: flex; justify-content: space-between; align-items: center">
                                    <div>
                                        {
                                            this.state.successData && <span style="color: green">
                                                Данные обновлены
                                            </span>
                                        }
                                    </div>
                                    <Button
                                        className={`save button-wrapper`}
                                        disabled={(
                                            this.state.errors.name
                                            || this.state.errors.surname
                                            || this.state.errors.phoneNumber
                                        )}
                                        title={'Сохранить данные'}
                                        onClick={() => this.handleSaveData()}
                                    />
                                </div>
                            </div>

                            <div className={`fields-column`}>
                                <TextField
                                    fieldName='Старый пароль'
                                    title={""}
                                    type="password"
                                    validType={ValidTypes.NotNullValid}
                                    value={`${this.state.oldPassword}`}
                                    onEnd={(ok: any, v: any) => this.handleChange("oldPassword", ok, v)}
                                />

                                <TextField
                                    fieldName='Новый пароль'
                                    title={""}
                                    validType={ValidTypes.PasswordValid}
                                    type="password"
                                    value={`${this.state.password}`}
                                    onEnd={(ok: any, v: any) => this.handleChange("password", ok, v)}
                                />
                                <TextField
                                    fieldName='Новый пароль ещё раз'
                                    title={""}
                                    validType={ValidTypes.PasswordValid}
                                    type="password"
                                    value={`${this.state.repeatPassword}`}
                                    onEnd={(ok: any, v: any) => this.handleChange("repeatPassword", ok, v)}
                                />
                                <div style="display: flex; justify-content: space-between; align-items: center">
                                    <div>
                                        {
                                            this.state.errors.notRepeatPassword && <span style="color: red">
                                                Пароли не совпадают!
                                            </span>
                                        }
                                        {
                                            this.state.errors.wrongPassword && <span style="color: red">
                                                Неверный старый пароль!
                                            </span>
                                        }
                                        {
                                            this.state.successPassword && <span style="color: green">
                                                Пароль обновлен
                                            </span>
                                        }
                                    </div>
                                    <Button
                                        className={`save`}
                                        title={'Изменить пароль'}
                                        disabled={(
                                            this.state.errors.password
                                            || this.state.errors.repeatPassword
                                            || this.state.errors.oldPassword
                                        )}
                                        onClick={() => this.handleSavePassword()}
                                    />
                                </div>
                            </div>
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
            </main >

            <Footer />
        </div >
    }
}
