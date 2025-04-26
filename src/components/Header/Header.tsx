import Tarakan from "bazaar-tarakan";

import Button, { BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION } from "../Button/Button";
import TextField, { TEXTFIELD_TYPES } from "../TextField/TextField";

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

import MenuIcon from "../../shared/images/menu.svg";
import CrossIcon from "../../shared/images/cross-ico.svg";

import HeaderLogin from "../../shared/images/header-profile-enter-ico.svg";
import HeaderLoginHover from "../../shared/images/header-profile-enter-ico-hover.svg";
import { getAllCategories } from "../../api/categories";
import { AJAXErrors } from "../../api/errors";
import { getSearchResult, getSearchResultItems } from "../../api/product";

class Header extends Tarakan.Component {
    init() {
        this.state = {
            ordersIcon: HeaderOrders,
            cartIcon: HeaderCart,
            savedIcon: HeaderSaved,
            profileIcon: this.app.store.user.value.login ? HeaderProfile : HeaderLogin,
            authorized: this.app.store.user.value.login,
            popUpDisplayed: false,
            menuOpened: false,
            searchMenuOpened: false,
            searchResult: null,
            searchValue: "",
            categories: null,
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
        const categories = await this.app.store.products.sendAction("getCategories");
        this.setState({
            categories: categories.slice(0, 6)
        });
    }

    async fetchSearchResult(ev: any) {
        const searchValue = ev.target.value;
        const { code, data } = await getSearchResult(searchValue);
        if (code === AJAXErrors.NoError) {
            this.setState({ searchResult: data, searchValue });
        }
    }

    async openProduct(index: number) {
        const { code, data } = await getSearchResultItems(this.state.searchValue);
        if (code === AJAXErrors.NoError && data.products) {
            this.app.navigateTo(`/product/${data.products.products[index].id}`);
            this.setState({ searchMenuOpened: false })
        }
    }

    async openCategory(index: number) {
        const { code, data } = await getSearchResultItems(this.state.searchValue);
        if (code === AJAXErrors.NoError && data.categories) {
            this.app.navigateTo(`/category/${data.categories.categories[index].id}`);
            this.setState({ searchMenuOpened: false })
        }
    }

    render(props: any, app: any) {
        return <header className="header header_light">
            <div className="header__nav">
                <div className="header__nav__row header__nav__row_main">
                    <img
                        className="header__nav__logo"
                        alt='Логотип маркетплейса Bazaar'
                        src={`${LogoFull}`}
                        onClick={() => {
                            app.navigateTo("/");
                        }}
                    />

                    <div className="header__nav__row_main__search-field-wrapper">
                        <Button
                            size={BUTTON_SIZE.L}
                            title='Каталог'
                            iconSrc={`${CatalogButtonIcon}`}
                            iconAlt='Иконка каталога'
                            onClick={() => {
                                this.setState({ popUpDisplayed: !this.state.popUpDisplayed });
                            }}
                        />

                        <div className="header__nav__row_main__search-field-wrapper__body">
                            <TextField
                                type={`${TEXTFIELD_TYPES.SEARCH}`}
                                title='Ищите что угодно на Bazaar'
                                className={`width header__nav__row_main__search-field-wrapper__body__field`}
                                onChange={(ev: any) => this.fetchSearchResult(ev)}
                                onFocus={() => this.setState({ searchMenuOpened: true })}
                                onEnd={() => {
                                    if (this.state.searchResult === "") {
                                        this.setState({ searchMenuOpened: false })
                                    }
                                }}
                            />
                            {(this.state.searchMenuOpened && this.state.searchResult) && <div className="header__nav__row_main__search-field-wrapper__body__modal">
                                <div
                                    className="header__nav__row_main__search-field-wrapper__body__modal_tint"
                                    onClick={() => this.setState({ searchMenuOpened: false })}
                                />
                                <div className="header__nav__row_main__search-field-wrapper__body__modal_content">
                                    {
                                        this.state.searchResult.categories &&
                                        <div className="header__nav__row_main__search-field-wrapper__body__modal_content__item">
                                            <h3>Найденные категории</h3>
                                            <ul>
                                                {
                                                    this.state.searchResult.categories.slice(0, 3).map((e, I) =>
                                                        <li onClick={() => this.openCategory(I)}>{e.name}</li>
                                                    )
                                                }
                                            </ul>
                                            {this.state.searchResult.categories.length > 3 && <Button
                                                className="header__nav__row_main__search-field-wrapper__body__modal_content__item__link"
                                                title={`Все найденные категории (${this.state.searchResult.categories.length})`}
                                                size="m"
                                                variant="text"
                                                onClick={() => {
                                                    app.navigateTo("/search", {
                                                        r: this.state.searchValue
                                                    })
                                                }}
                                            />}
                                        </div>
                                    }
                                    {
                                        this.state.searchResult.products &&
                                        <div className="header__nav__row_main__search-field-wrapper__body__modal_content__item">
                                            <h3>Найденные товары</h3>
                                            <ul>
                                                {
                                                    this.state.searchResult.products.slice(0, 5).map((e, I) =>
                                                        <li onClick={() => this.openProduct(I)}>{e.name}</li>
                                                    )
                                                }
                                            </ul>
                                            {this.state.searchResult.products.length > 3 && <Button
                                                className="header__nav__row_main__search-field-wrapper__body__modal_content__item__link"
                                                title={`Все найденные товары (${this.state.searchResult.products.length})`}
                                                size="m"
                                                variant="text"
                                                onClick={() => {
                                                    app.navigateTo("/search", {
                                                        r: this.state.searchValue
                                                    })
                                                }}
                                            />}
                                        </div>
                                    }
                                    {
                                        (!this.state.searchResult.categories && !this.state.searchResult.products) &&
                                        "Ничего не удалось найти"
                                    }
                                </div>
                            </div>}
                        </div>

                    </div>

                    <div className="header__nav__row_main__icons-wrapper">

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
                                    app.navigateTo('/orders');
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

                    <div className="header__nav__row_main__icons-wrapper__phone">
                        <img
                            className="header__nav__row_main__icons-wrapper__phone__button"
                            src={MenuIcon}
                            onClick={() => this.setState({ menuOpened: true })}
                        />
                    </div>

                    <div className={`menu-modal${this.state.menuOpened ? " opened" : ""}`}>
                        <div className="menu-modal__tint"></div>
                        <div className="menu-modal__content">
                            <div className="menu-modal__content__padding">
                                <div className="menu-modal__content__title">
                                    <img
                                        className="header__nav__row_main__icons-wrapper__phone__button"
                                        src={CrossIcon}
                                        onClick={() => this.setState({ menuOpened: false })}
                                    />
                                    <span className="menu-modal__content__title__text">Меню</span>
                                </div>
                                <Button
                                    title="Профиль"
                                    iconSrc={HeaderProfile}
                                    variant="text"
                                    className="menu-modal__content__button"
                                    onClick={() => {
                                        app.navigateTo('/profile');
                                    }}
                                />
                                <Button
                                    title="Избранное"
                                    iconSrc={HeaderSaved}
                                    variant="text"
                                    className="menu-modal__content__button"
                                />
                                <Button
                                    title="Корзина"
                                    iconSrc={HeaderCart}
                                    variant="text"
                                    className="menu-modal__content__button"
                                    onClick={() => {
                                        app.navigateTo('/cart');
                                    }}
                                />
                                <Button
                                    title="Заказы"
                                    iconSrc={HeaderOrders}
                                    variant="text"
                                    className="menu-modal__content__button"
                                    onClick={() => {
                                        app.navigateTo('/orders');
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                <div
                    className={`header__nav__secondary${this.state.popUpDisplayed ? " hidden" : ""}`}
                >
                    <div className={`categories-wrapper`}>
                        {
                            this.state.categories &&
                            this.state.categories.map((category: any) =>
                                <span onClick={() => {
                                    app.navigateTo(`/category/${category.id}`);
                                }}>
                                    {category.name}
                                </span>
                            )
                        }
                    </div>
                </div>
            </div>

            <div className={`header__pop-up${this.state.popUpDisplayed ? " opened" : ""}`}>
                <div className="header__pop-up__list">
                    {
                        this.state.categories &&
                        this.state.categories.map((item: any) =>
                            <Button
                                title={`${item.name}`}
                                variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                onClick={() => {
                                    this.setState({ popUpDisplayed: false })
                                    app.navigateTo(`/category/${item.id}`);
                                }}
                                className="header__pop-up__list__button"
                                onMouseOver={(e) => {
                                    // console.log(e.target);
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
        </header >
    }
}

export default Header;