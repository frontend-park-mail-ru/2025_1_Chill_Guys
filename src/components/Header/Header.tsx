import Tarakan from "bazaar-tarakan";

import Button, {
    BUTTON_SIZE,
    BUTTON_VARIANT,
    ICON_POSITION,
} from "../Button/Button";
import TextField, { TEXTFIELD_TYPES } from "../TextField/TextField";

import "./styles.scss";

import LogoFull from "../../shared/images/LogoFull.svg";
import CatalogButtonIcon from "../../shared/images/catalog-button-ico.svg";

import HeaderOrders from "../../shared/images/header-orders-ico.svg";
import HeaderOrdersHover from "../../shared/images/header-orders-ico-hover.svg";

import HeaderCart from "../../shared/images/header-cart-ico.svg";
import HeaderCartHover from "../../shared/images/header-cart-ico-hover.svg";

import HeaderProfile from "../../shared/images/header-profile-ico.svg";
import HeaderProfileHover from "../../shared/images/header-profile-ico-hover.svg";

import ToolIcon from "../../shared/images/tool-ico.svg";
import ToolIconHover from "../../shared/images/tool-ico-hover.svg";

import BellIcon from "../../shared/images/bell-ico.svg";
import BellIconHover from "../../shared/images/bell-ico-hover.svg";

import MenuIcon from "../../shared/images/menu.svg";
import CrossIcon from "../../shared/images/cross-ico.svg";

import SearchIcon from "../../shared/images/search-ico-gray.svg";

import HeaderLogin from "../../shared/images/header-profile-enter-ico.svg";
import HeaderLoginHover from "../../shared/images/header-profile-enter-ico-hover.svg";
import { AJAXErrors } from "../../api/errors";
import { getSearchResult, getSearchResultItems } from "../../api/product";
import CSAT from "../../pages/CSAT/CSAT";

class Header extends Tarakan.Component {
    init() {
        this.state = {
            ordersIcon: HeaderOrders,
            cartIcon: HeaderCart,
            iconIcon: ToolIcon,
            profileIcon: this.app.store.user.value.login
                ? HeaderProfile
                : HeaderLogin,
            bellIcon: BellIcon,
            authorized: this.app.store.user.value.login,
            role: this.app.store.user.value.role,
            popUpDisplayed: false,
            menuOpened: false,
            searchMenuOpened: false,
            searchResult: null,
            searchValue: "",
            categories: null,
            selectedCategory: null,
            subcategories: null,
            showSearchMobile: false,
            mode: "comp",
        };

        this.fetchCategories();

        this.subscribe("user", (name: string, newValue: any) => {
            if (name === "login") {
                this.setState({
                    profileIcon: newValue.login ? HeaderProfile : HeaderLogin,
                    authorized: newValue.login,
                    role: newValue.role,
                });
            }
            if (name === "nots_count") {
                this.updateDOM();
            }
        });
    }

    async fetchCategories() {
        const categories =
            await this.app.store.products.sendAction("getCategories");
        this.setState({
            categories: categories.slice(0, 6),
        });
    }

    async fetchSubcategories(category: any) {
        const data = await this.app.store.products.sendAction(
            "getSubCategories",
            category.id,
        );
        this.setState({
            subcategories: data,
            selectedCategory: category,
        });
    }

    async fetchSearchResult(ev: any) {
        const searchValue = ev.target.value;
        const { code, data } = await getSearchResult(searchValue);
        if (code === AJAXErrors.NoError) {
            this.setState({
                searchResult: data,
                searchValue,
                showSearchMobile: this.state.mode === "phone",
                searchMenuOpened: this.state.mode !== "phone",
            });
        }
    }

    async openProduct(product: any) {
        this.setState({
            showSearchMobile: false,
            searchMenuOpened: false,
        });

        this.app.navigateTo(`/search`, {
            r: product.name,
        });
    }

    async openCategory(cat: number) {
        this.setState({ searchMenuOpened: false });

        const { code, data } = await getSearchResultItems(
            this.state.searchValue,
        );
        if (code === AJAXErrors.NoError) {
            this.app.navigateTo(
                `/category/${data.categories.categories[cat].id}`,
            );
        }
    }

    render(props: any, app: any) {
        return (
            <header className="header header_light">
                {this.state.csatString && (
                    <CSAT
                        id={this.state.csatString}
                        onEnd={() => this.setState({ csatString: "" })}
                    />
                )}
                <div className="header__nav">
                    <div className="header__nav__row header__nav__row_main">
                        {!this.state.showSearchMobile ? (
                            <img
                                className="header__nav__logo"
                                alt="Логотип маркетплейса Bazaar"
                                src={`${LogoFull}`}
                                onClick={() => {
                                    if (location.pathname === "/") {
                                        window.scroll({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    } else {
                                        app.navigateTo("/");
                                    }
                                }}
                            />
                        ) : (
                            <TextField
                                className="header__nav__tf"
                                type={`${TEXTFIELD_TYPES.SEARCH}`}
                                title="Введите"
                                onChange={(ev: any) => {
                                    this.fetchSearchResult(ev);
                                }}
                                onFocus={() =>
                                    this.setState({
                                        searchMenuOpened: true,
                                        mode: "phone",
                                        selectedCategory: null,
                                    })
                                }
                                onKeyEnter={() => {
                                    this.setState({
                                        showSearchMobile: false,
                                        searchMenuOpened: false,
                                    });
                                    app.navigateTo("/search", {
                                        r: this.state.searchValue,
                                    });
                                }}
                                onEnd={() => {
                                    if (this.state.searchValue === "") {
                                        this.setState({
                                            searchMenuOpened: false,
                                        });
                                    }
                                }}
                            />
                        )}

                        {this.state.showSearchMobile &&
                            this.state.searchResult && (
                                <div className="header__nav__row_main__search-field-wrapper__body__modal">
                                    <div
                                        className="header__nav__row_main__search-field-wrapper__body__modal_tint"
                                        onClick={() =>
                                            this.setState({
                                                searchMenuOpened: false,
                                            })
                                        }
                                    />
                                    <div className="header__nav__row_main__search-field-wrapper__body__modal_content">
                                        {this.state.searchResult.products && (
                                            <div className="header__nav__row_main__search-field-wrapper__body__modal_content__item">
                                                {this.state.searchValue !==
                                                    "" && (
                                                        <h3>Найденные товары</h3>
                                                    )}
                                                {this.state.searchValue ===
                                                    "" ? (
                                                    <div style="font-style: italic">
                                                        Введите что-нибудь для
                                                        поиска товаров
                                                    </div>
                                                ) : (
                                                    <ul>
                                                        {this.state.searchResult.products
                                                            .slice(0, 5)
                                                            .map((e) => (
                                                                <li
                                                                    onClick={() =>
                                                                        this.openProduct(
                                                                            e,
                                                                        )
                                                                    }
                                                                >
                                                                    {e.name}
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                                {this.state.searchResult
                                                    .products.length > 3 &&
                                                    this.state.searchValue !==
                                                    "" && (
                                                        <Button
                                                            className="header__nav__row_main__search-field-wrapper__body__modal_content__item__link"
                                                            title={`Все найденные товары (${this.state.searchResult.products.length})`}
                                                            size="m"
                                                            variant="text"
                                                            onClick={() => {
                                                                app.navigateTo(
                                                                    "/search",
                                                                    {
                                                                        r: this
                                                                            .state
                                                                            .searchValue,
                                                                    },
                                                                );
                                                            }}
                                                        />
                                                    )}
                                            </div>
                                        )}
                                        {!this.state.searchResult.categories &&
                                            !this.state.searchResult.products &&
                                            "Ничего не удалось найти"}
                                    </div>
                                </div>
                            )}

                        <div className="header__nav__row_main__search-field-wrapper">
                            <Button
                                size={BUTTON_SIZE.L}
                                title="Каталог"
                                iconSrc={`${CatalogButtonIcon}`}
                                iconAlt="Иконка каталога"
                                onClick={() => {
                                    this.setState({
                                        popUpDisplayed:
                                            !this.state.popUpDisplayed,
                                    });
                                }}
                            />

                            <div className="header__nav__row_main__search-field-wrapper__body">
                                <TextField
                                    type={`${TEXTFIELD_TYPES.SEARCH}`}
                                    title="Ищите что угодно на Bazaar"
                                    className={`width header__nav__row_main__search-field-wrapper__body__field`}
                                    onChange={(ev: any) => {
                                        this.fetchSearchResult(ev);
                                    }}
                                    onFocus={() =>
                                        this.setState({
                                            mode: "comp",
                                            searchMenuOpened: true,
                                            selectedCategory: null,
                                        })
                                    }
                                    onEnd={() => {
                                        if (this.state.searchValue === "") {
                                            this.setState({
                                                searchMenuOpened: false,
                                            });
                                        }
                                    }}
                                    onKeyEnter={() => {
                                        this.setState({
                                            showSearchMobile: false,
                                            searchMenuOpened: false,
                                        });
                                        app.navigateTo("/search", {
                                            r: this.state.searchValue,
                                        });
                                    }}
                                />
                                {this.state.searchMenuOpened &&
                                    this.state.searchResult && (
                                        <div className="header__nav__row_main__search-field-wrapper__body__modal">
                                            <div
                                                className="header__nav__row_main__search-field-wrapper__body__modal_tint"
                                                onClick={() =>
                                                    this.setState({
                                                        searchMenuOpened: false,
                                                    })
                                                }
                                            />
                                            <div className="header__nav__row_main__search-field-wrapper__body__modal_content">
                                                {this.state.searchResult
                                                    .products && (
                                                        <div className="header__nav__row_main__search-field-wrapper__body__modal_content__item">
                                                            {this.state
                                                                .searchValue !==
                                                                "" && (
                                                                    <h3>
                                                                        Найденные товары
                                                                    </h3>
                                                                )}
                                                            {this.state
                                                                .searchValue ===
                                                                "" ? (
                                                                <div style="font-style: italic">
                                                                    Введите
                                                                    что-нибудь для
                                                                    поиска товаров
                                                                </div>
                                                            ) : (
                                                                <ul>
                                                                    {this.state.searchResult.products
                                                                        .slice(0, 5)
                                                                        .map(
                                                                            (e) => (
                                                                                <li
                                                                                    onClick={() =>
                                                                                        this.openProduct(
                                                                                            e,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        e.name
                                                                                    }
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                </ul>
                                                            )}
                                                            {this.state.searchResult
                                                                .products.length >
                                                                3 &&
                                                                this.state
                                                                    .searchValue !==
                                                                "" && (
                                                                    <Button
                                                                        className="header__nav__row_main__search-field-wrapper__body__modal_content__item__link"
                                                                        title={`Все найденные товары (${this.state.searchResult.products.length})`}
                                                                        size="m"
                                                                        variant="text"
                                                                        onClick={() => {
                                                                            app.navigateTo(
                                                                                "/search",
                                                                                {
                                                                                    r: this
                                                                                        .state
                                                                                        .searchValue,
                                                                                },
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                        </div>
                                                    )}
                                                {!this.state.searchResult
                                                    .categories &&
                                                    !this.state.searchResult
                                                        .products &&
                                                    "Ничего не удалось найти"}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className="header__nav__row_main__icons-wrapper">
                            {this.state.authorized &&
                                (this.state.role === "admin" ||
                                    this.state.role === "seller" ||
                                    this.state.role === "warehouseman") && (
                                    <Button
                                        size={`${BUTTON_SIZE.L}`}
                                        iconPosition={`${ICON_POSITION.TOP}`}
                                        variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                        title={
                                            this.state.role === "seller"
                                                ? "Продажа"
                                                : "Консоль"
                                        }
                                        iconSrc={`${this.state.iconIcon}`}
                                        iconAlt="Иконка сердечко"
                                        onMouseOver={() => {
                                            this.setState({
                                                iconIcon: ToolIconHover,
                                            });
                                        }}
                                        onMouseLeave={() => {
                                            this.setState({
                                                iconIcon: ToolIcon,
                                            });
                                        }}
                                        onClick={() => {
                                            switch (this.state.role) {
                                                case "admin":
                                                    app.navigateTo("/admin");
                                                    break;
                                                case "seller":
                                                    app.navigateTo("/seller");
                                                    break;
                                                case "warehouseman":
                                                    app.navigateTo(
                                                        "/warehouse",
                                                    );
                                                    break;
                                            }
                                        }}
                                    />
                                )}
                            {this.state.authorized && (
                                <Button
                                    size={`${BUTTON_SIZE.L}`}
                                    iconPosition={`${ICON_POSITION.TOP}`}
                                    variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                    title="Уведомления"
                                    iconSrc={`${this.state.bellIcon}`}
                                    iconAlt="Уведомления"
                                    badgeTitle={
                                        app.store.user.value.unread_count || ""
                                    }
                                    onMouseOver={() => {
                                        this.setState({
                                            bellIcon: BellIconHover,
                                        });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({
                                            bellIcon: BellIcon,
                                        });
                                    }}
                                    onClick={() => {
                                        app.navigateTo("/notifications");
                                    }}
                                />
                            )}
                            {this.state.authorized && (
                                <Button
                                    size={`${BUTTON_SIZE.L}`}
                                    iconPosition={`${ICON_POSITION.TOP}`}
                                    variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                    title="Заказы"
                                    iconSrc={`${this.state.ordersIcon}`}
                                    iconAlt="Иконка заказов"
                                    onMouseOver={() => {
                                        this.setState({
                                            ordersIcon: HeaderOrdersHover,
                                        });
                                    }}
                                    onMouseLeave={() => {
                                        this.setState({
                                            ordersIcon: HeaderOrders,
                                        });
                                    }}
                                    onClick={() => {
                                        app.navigateTo("/orders");
                                    }}
                                />
                            )}
                            <Button
                                size={`${BUTTON_SIZE.L}`}
                                iconPosition={`${ICON_POSITION.TOP}`}
                                variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                title="Корзина"
                                iconSrc={`${this.state.cartIcon}`}
                                iconAlt="Иконка корзины"
                                onMouseOver={() => {
                                    this.setState({
                                        cartIcon: HeaderCartHover,
                                    });
                                }}
                                onMouseLeave={() => {
                                    this.setState({ cartIcon: HeaderCart });
                                }}
                                onClick={() => {
                                    app.navigateTo("/cart");
                                }}
                            />

                            <Button
                                size={`${BUTTON_SIZE.L}`}
                                iconPosition={`${ICON_POSITION.TOP}`}
                                variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                title={
                                    this.state.authorized ? "Профиль" : "Войти"
                                }
                                iconSrc={`${this.state.profileIcon}`}
                                iconAlt="Иконка профиля"
                                onMouseOver={() => {
                                    if (this.state.authorized) {
                                        this.setState({
                                            profileIcon: HeaderProfileHover,
                                        });
                                    } else {
                                        this.setState({
                                            profileIcon: HeaderLoginHover,
                                        });
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (this.state.authorized) {
                                        this.setState({
                                            profileIcon: HeaderProfile,
                                        });
                                    } else {
                                        this.setState({
                                            profileIcon: HeaderLogin,
                                        });
                                    }
                                }}
                                onClick={() => {
                                    if (this.state.authorized) {
                                        app.navigateTo("/profile");
                                    } else {
                                        app.navigateTo("/signin");
                                    }
                                }}
                            />
                        </div>

                        <div className="header__nav__row_main__icons-wrapper__phone">
                            <img
                                className="header__nav__row_main__icons-wrapper__phone__button s"
                                src={SearchIcon}
                                onClick={() =>
                                    this.setState({
                                        showSearchMobile:
                                            !this.state.showSearchMobile,
                                        mode: "phone",
                                    })
                                }
                            />
                            <img
                                className="header__nav__row_main__icons-wrapper__phone__button"
                                src={MenuIcon}
                                onClick={() =>
                                    this.setState({ menuOpened: true })
                                }
                            />
                        </div>

                        <div
                            className={`menu-modal${this.state.menuOpened ? " opened" : ""}`}
                        >
                            <div className="menu-modal__tint"></div>
                            <div className="menu-modal__content">
                                <div className="menu-modal__content__padding">
                                    <div className="menu-modal__content__title">
                                        <img
                                            className="header__nav__row_main__icons-wrapper__phone__button"
                                            src={CrossIcon}
                                            onClick={() =>
                                                this.setState({
                                                    menuOpened: false,
                                                })
                                            }
                                        />
                                        <span className="menu-modal__content__title__text">
                                            Меню
                                        </span>
                                    </div>
                                    <Button
                                        title="Поиск"
                                        iconSrc={SearchIcon}
                                        variant="text"
                                        className="menu-modal__content__button"
                                        onClick={() => {
                                            this.setState({
                                                menuOpened: false,
                                            });
                                            app.navigateTo("/search?r=");
                                        }}
                                    />
                                    {this.state.authorized && (
                                        <Button
                                            title="Уведомления"
                                            badgeTitle={
                                                app.store.user.value
                                                    .unread_count || ""
                                            }
                                            iconSrc={BellIcon}
                                            variant="text"
                                            className="menu-modal__content__button"
                                            onClick={() => {
                                                app.navigateTo(
                                                    "/notifications",
                                                );
                                            }}
                                        />
                                    )}
                                    <Button
                                        title={
                                            this.state.authorized
                                                ? "Профиль"
                                                : "Войти"
                                        }
                                        iconSrc={
                                            this.state.authorized
                                                ? HeaderProfile
                                                : HeaderLogin
                                        }
                                        variant="text"
                                        className="menu-modal__content__button"
                                        onClick={() => {
                                            this.setState({
                                                menuOpened: false,
                                            });
                                            app.navigateTo("/profile");
                                        }}
                                    />
                                    {this.state.authorized && (
                                        <Button
                                            title="Корзина"
                                            iconSrc={HeaderCart}
                                            variant="text"
                                            className="menu-modal__content__button"
                                            onClick={() => {
                                                this.setState({
                                                    menuOpened: false,
                                                });
                                                app.navigateTo("/cart");
                                            }}
                                        />
                                    )}
                                    {this.state.authorized && (
                                        <Button
                                            title="Заказы"
                                            iconSrc={HeaderOrders}
                                            variant="text"
                                            className="menu-modal__content__button"
                                            onClick={() => {
                                                this.setState({
                                                    menuOpened: false,
                                                });
                                                app.navigateTo("/orders");
                                            }}
                                        />
                                    )}
                                    {this.state.authorized &&
                                        (this.state.role === "admin" ||
                                            this.state.role === "seller" ||
                                            this.state.role ===
                                            "warehouseman") && (
                                            <Button
                                                title={
                                                    this.state.role === "seller"
                                                        ? "Продажа"
                                                        : "Консоль"
                                                }
                                                variant="text"
                                                className="menu-modal__content__button"
                                                iconSrc={ToolIcon}
                                                onClick={() => {
                                                    switch (this.state.role) {
                                                        case "admin":
                                                            app.navigateTo(
                                                                "/admin",
                                                            );
                                                            break;
                                                        case "seller":
                                                            app.navigateTo(
                                                                "/seller",
                                                            );
                                                            break;
                                                        case "warehouseman":
                                                            app.navigateTo(
                                                                "/warehouse",
                                                            );
                                                            break;
                                                    }
                                                }}
                                            />
                                        )}
                                    {this.state.role === "buyer" && (
                                        <Button
                                            title="Хочу&#160;стать&#160;продавцом!"
                                            variant="text"
                                            className="bottom-button"
                                            onClick={() =>
                                                app.navigateTo("/seller-form")
                                            }
                                        />
                                    )}
                                    {this.state.role === "pending" && (
                                        <div className="header__nav__secondary__seller-pending">
                                            Заявка&#160;на&#160;продавца&#160;отправлена
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`header__nav__secondary${this.state.popUpDisplayed ? " hidden" : ""}`}
                    >
                        <div className={`categories-wrapper`}>
                            {this.state.categories &&
                                this.state.categories.map((category: any) => (
                                    <div
                                        onMouseLeave={() => {
                                            this.setState({
                                                selectedCategory: null,
                                            });
                                        }}
                                    >
                                        <span
                                            className="categories-wrapper__item"
                                            onMouseOver={() => {
                                                if (
                                                    !this.state
                                                        .selectedCategory ||
                                                    category.id !==
                                                    this.state
                                                        .selectedCategory.id
                                                ) {
                                                    this.fetchSubcategories(
                                                        category,
                                                    );
                                                }
                                            }}
                                        >
                                            <span className="categories-wrapper__item__value">
                                                {category.name}
                                            </span>
                                            {this.state.selectedCategory?.id ===
                                                category.id && (
                                                    <div className="subcategories-modal">
                                                        <div className="subcategories-modal__items">
                                                            {this.state.subcategories.map(
                                                                (E) => (
                                                                    <span
                                                                        className="subcategories-modal__items__item"
                                                                        onClick={() => {
                                                                            this.setState(
                                                                                {
                                                                                    selectedCategory:
                                                                                        null,
                                                                                },
                                                                            );
                                                                            app.navigateTo(
                                                                                "/category/" +
                                                                                E.id,
                                                                            );
                                                                        }}
                                                                    >
                                                                        {E.name}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </span>
                                    </div>
                                ))}
                        </div>
                        {this.state.role === "buyer" && (
                            <div
                                className="header__nav__secondary__seller"
                                onClick={() => app.navigateTo("/seller-form")}
                            >
                                Хочу стать продавцом!
                            </div>
                        )}
                        {this.state.role === "pending" && (
                            <div className="header__nav__secondary__seller-pending">
                                Заявка на продавца отправлена
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`header__pop-up${this.state.popUpDisplayed ? " opened" : ""}`}
                >
                    <div className="header__pop-up__list">
                        {this.state.categories &&
                            this.state.categories.map((item: any) => (
                                <Button
                                    title={`${item.name}`}
                                    variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                    className="header__pop-up__list__button"
                                    onMouseOver={() => {
                                        if (
                                            !this.state.selectedCategory ||
                                            item.id !==
                                            this.state.selectedCategory.id
                                        ) {
                                            this.fetchSubcategories(item);
                                        }
                                    }}
                                />
                            ))}
                    </div>
                    <div className="header__pop-up__info-wrapper">
                        <h2
                            id="category-h2"
                            className="h2-reset header__pop-up__info-wrapper__category-title"
                        >
                            {this.state.selectedCategory
                                ? this.state.selectedCategory.name
                                : "Выберите категорию"}
                        </h2>
                        <div className="header__pop-up__info-wrapper__list">
                            {this.state.subcategories &&
                                this.state.subcategories.map((e) => (
                                    <Button
                                        title={`${e.name}`}
                                        variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                                        onClick={() => {
                                            this.setState({
                                                popUpDisplayed: false,
                                            });
                                            app.navigateTo(`/category/${e.id}`);
                                        }}
                                        className="header__pop-up__info-wrapper__list__item"
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
