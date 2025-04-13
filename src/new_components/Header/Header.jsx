import Tarakan from "../../../modules/tarakan.js";
import ajax from "../../../modules/ajax.js";

import Button, { BUTTON_VARIANT, ICON_POSITION } from "../Button/Button.jsx";
import TextField from "../TextField/TextField.jsx";
import { BUTTON_SIZE } from "../Button/Button.jsx";
import { TEXTFIELD_TYPES } from "../TextField/TextField.jsx";
import { SERVER_URL } from "../../settings.js";

import "./styles.scss";

import LogoFull from "../../shared/images/LogoFull.svg";
import CatalogButtonIcon from "../../shared/images/catalog-button-ico.svg";

import HeaderOrders from "../../shared/images/header-orders-ico.svg";
import HeaderOrdersHover from "../../shared/images/header-orders-ico-hover.svg";

import HeaderSaved from "../../shared/images/header-saved-ico.svg";
import HeaderSavedHover from "../../shared/images/header-saved-ico-hover.svg";

import HeaderCart from "../../shared/images/header-cart-ico.svg";
import HeaderCartHover from "../../shared/images/header-cart-ico-hover.svg"

import HeaderProfile from "../../shared/images/header-profile-ico.svg";
import HeaderProfileHover from "../../shared/images/header-profile-ico-hover.svg";

import HeaderLogin from "../../shared/images/header-profile-enter-ico.svg";
import HeaderLoginHover from "../../shared/images/header-profile-enter-ico-hover.svg";

class Header extends Tarakan.Component {
    init() {
        this.state = {
            ordersIcon: HeaderOrders,
            cartIcon: HeaderCart,
            savedIcon: HeaderSaved,
            profileIcon: this.app.store.user.value.login ? HeaderProfile : HeaderLogin,
            authorized: this.app.store.user.value.login,
        }

        this.subscribe("user", (name, newValue) => {
            if (name === "login") {
                this.setState({
                    profileIcon: newValue.login ? HeaderProfile : HeaderLogin,
                    authorized: newValue.login
                });
            }
        });
    }

    render(props, app) {
        console.log(`Authorized: ${this.state.authorized}`)
        return <header className={`header light flex column gap10px`}>

            <div className={`row flex main`}>
                <img
                    className={`logo`}
                    alt='Логотип маркетплейса Bazaar'
                    src={`${LogoFull}`}
                    onClick={() => {
                        app.navigateTo("/");
                    }}
                />

                <div className={`search-field-wrapper flex`}>
                    <Button
                        size={BUTTON_SIZE.L}
                        title='Каталог'
                        iconSrc={`${CatalogButtonIcon}`}
                        iconAlt='Иконка каталога'
                        onClick={() => {
                            console.log('hello, world!');
                        }}
                    />

                    <div className={`tf`}>
                        <TextField
                            type={`${TEXTFIELD_TYPES.SEARCH}`}
                            title='Ищите что угодно на Bazaar'
                            className={`width px400`}
                        />
                    </div>
                </div>

                <div className={`icons-wrapper flex`}>

                    {
                        this.state.authorized
                        &&
                        <Button
                            size={`${BUTTON_SIZE.L}`}
                            iconPosition={`${ICON_POSITION.TOP}`}
                            variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                            title='Заказы'
                            iconSrc={`${this.state.ordersIcon}`}
                            iconAlt='Иконка заказов'
                            onMouseOver={() => {
                                this.setState({ ordersIcon: HeaderOrdersHover })
                            }}
                            onMouseLeave={() => {
                                this.setState({ ordersIcon: HeaderOrders })
                            }}
                            onClick={() => {
                                console.log('Открываю заказы');
                            }}
                        />
                    }

                    {
                        this.state.authorized
                        &&
                        <Button
                            size={`${BUTTON_SIZE.L}`}
                            iconPosition={`${ICON_POSITION.TOP}`}
                            variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                            title='Избранное'
                            iconSrc={`${this.state.savedIcon}`}
                            iconAlt='Иконка сердечко'
                            onMouseOver={() => {
                                this.setState({ savedIcon: HeaderSavedHover })
                            }}
                            onMouseLeave={() => {
                                this.setState({ savedIcon: HeaderSaved })
                            }}
                            onClick={() => {
                                console.log('Открываю избранное');
                            }}
                        />
                    }
                    <Button
                        size={`${BUTTON_SIZE.L}`}
                        iconPosition={`${ICON_POSITION.TOP}`}
                        variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                        title='Корзина'
                        iconSrc={`${this.state.cartIcon}`}
                        iconAlt='Иконка корзины'
                        onMouseOver={() => {
                            this.setState({ cartIcon: HeaderCartHover })
                        }}
                        onMouseLeave={() => {
                            this.setState({ cartIcon: HeaderCart })
                        }}
                        onClick={() => {
                            app.navigateTo("/cart");
                        }}
                    />

                    <Button
                        size={`${BUTTON_SIZE.L}`}
                        iconPosition={`${ICON_POSITION.TOP}`}
                        variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                        title={this.state.authorized ? 'Профиль' : 'Войти'}
                        iconSrc={`${this.state.profileIcon}`}
                        iconAlt='Иконка профиля'
                        onMouseOver={() => {
                            console.log('profile mouse over');
                            console.log(this.state.authorized);
                            if (this.state.authorized) {
                                this.setState({ profileIcon: HeaderProfileHover });
                            } else {
                                this.setState({ profileIcon: HeaderLoginHover });
                            }
                        }}
                        onMouseLeave={() => {
                            if (this.state.authorized) {
                                this.setState({ profileIcon: HeaderProfile });
                            } else {
                                this.setState({ profileIcon: HeaderLogin });
                            }
                        }}
                        onClick={() => {
                            if (this.state.authorized) {
                                app.navigateTo('/profile');
                            } else {
                                app.navigateTo('/signin');
                            }
                        }}
                    />

                </div>

            </div>

            <div className={`row flex secondary`}>
                <div className={`address-wrapper`}>
                    Улица Космонавтов 7
                </div>
            </div>

        </header>
    }
}

export default Header;