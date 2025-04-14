import Tarakan from "bazaar-tarakan";

import Button, {BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION} from "../Button/Button";
import TextField, {TEXTFIELD_TYPES} from "../TextField/TextField";

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
import {getAllCategories} from "../../api/categories";
import {AJAXErrors} from "../../api/errors";

class Header extends Tarakan.Component {
    init() {
        this.state = {
            ordersIcon: HeaderOrders,
            cartIcon: HeaderCart,
            savedIcon: HeaderSaved,
            profileIcon: this.app.store.user.value.login ? HeaderProfile : HeaderLogin,
            authorized: this.app.store.user.value.login,
            popUpDisplayed: false,
        }
        this.fetchCategories();
        this.subscribe("user", (name: string, newValue: any) => {
            if (name === "login") {
                this.setState({
                    profileIcon: newValue.login ? HeaderProfile : HeaderLogin,
                    authorized: newValue.login
                });
            }
        });
    }

    async fetchCategories() {
        const response = await getAllCategories();
        if (response.code === AJAXErrors.NoError) {
            this.setState({
                categories: response.data.categories.map((item) => ({
                    id: item.id,
                    name: item.name,
                })).slice(0, 6)
            });
        }
    }

    render(props: any, app: any) {
        return <header className="header header_light">
            <div id="pop-up" className="header__pop-up">
                <div className="header__pop-up__list">
                    {
                        this.state.categories &&
                        this.state.categories.map((item) =>
                            <Button
                                title={`${item.name}`}
                                variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                onClick={() => {app.navigateTo(`/category/${item.id}`);}}
                                onMouseOver={(e) => {
                                    console.log(e.target);
                                    const categoryH2 = document.getElementById('category-h2');
                                    categoryH2.innerHTML = e.target.innerHTML;
                                }}
                            />
                        )
                    }
                </div>
                <div className="header__pop-up__info-wrapper">
                    <h2 id="category-h2" className="h2-reset header__pop-up__info-wrapper__category-title">Выберите категорию</h2>
                </div>
            </div>

            <div className="header__row header__row_main">
                <img
                    className="header__logo"
                    alt='Логотип маркетплейса Bazaar'
                    src={`${LogoFull}`}
                    onClick={() => {
                        app.navigateTo("/");
                    }}
                />

                <div className="header__row_main__search-field-wrapper">
                    <Button
                        size={BUTTON_SIZE.L}
                        title='Каталог'
                        iconSrc={`${CatalogButtonIcon}`}
                        iconAlt='Иконка каталога'
                        onClick={() => {
                            const popUp = document.getElementById("pop-up");
                            if (this.state.popUpDisplayed) {
                                popUp.style.display = "none";
                            } else {
                                popUp.style.display = "flex";
                            }
                            this.setState({popUpDisplayed: !this.state.popUpDisplayed});
                        }}
                    />

                    <div className={`tf`}>
                        <TextField
                            type={`${TEXTFIELD_TYPES.SEARCH}`}
                            title='Ищите что угодно на Bazaar'
                            className={`width header__row_main__search-field-wrapper__px400`}
                        />
                    </div>
                </div>

                <div className="header__row_main__icons-wrapper">

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
                                this.setState({ordersIcon: HeaderOrdersHover})
                            }}
                            onMouseLeave={() => {
                                this.setState({ordersIcon: HeaderOrders})
                            }}
                            onClick={() => {
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
                                this.setState({savedIcon: HeaderSavedHover})
                            }}
                            onMouseLeave={() => {
                                this.setState({savedIcon: HeaderSaved})
                            }}
                            onClick={() => {
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
                            this.setState({cartIcon: HeaderCartHover})
                        }}
                        onMouseLeave={() => {
                            this.setState({cartIcon: HeaderCart})
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
                            if (this.state.authorized) {
                                this.setState({profileIcon: HeaderProfileHover});
                            } else {
                                this.setState({profileIcon: HeaderLoginHover});
                            }
                        }}
                        onMouseLeave={() => {
                            if (this.state.authorized) {
                                this.setState({profileIcon: HeaderProfile});
                            } else {
                                this.setState({profileIcon: HeaderLogin});
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

            <div className="header__secondary">
                <div className={`categories-wrapper`}>
                    {
                        this.state.categories &&
                        this.state.categories.map((category) =>
                        <span onClick={() => {
                            app.navigateTo(`/category/${category.id}`);
                        }}>
                            {category.name}
                        </span>
                        )
                    }
                </div>
                <div className={`address-wrapper`}>
                    Улица Космонавтов 7
                </div>
            </div>
        </header>
    }
}

export default Header;