'use strict';

import ajax from "../../../modules/ajax.js";
import BaseComponent from "../baseComponent.js";
import Button, { ICON_POSITION } from "../button/button.js";
import TextField, { TextFieldMainClass } from "../textField/textField.js";

class Header extends BaseComponent {
    #props = {}

    constructor(props) {
        super("header/header");
        this.#props = props;
    }

    state = {
        user: null,
    }

    initState() {
        this.fetchUser();
    }

    async fetchUser() {
        const res = await ajax.get("api/users/me", { origin: "http://localhost:8081" });

        if (res.result?.status === 200) {
            const user = await res.result.json();
            this.setState({ user });
        }
    }

    async logoutUser() {
        const res = await ajax.post("api/auth/logout", {}, { origin: "http://localhost:8081" });

        if (res.result?.status === 200) {
            this.setState({ user: null });
        }
    }

    render(context) {
        const components = {
            "catalog-button": new Button({
                type: "success",
                title: "Каталог",
                isDisabled: false,
                iconAlt: "Иконка каталога",
                iconSrc: "src/shared/images/catalog-button-ico.svg",
                size: "l",
                onClick: () => { console.log('hello, world!') },
            }),
            "main-search-input": new TextField({
                type: "search",
                placeholder: "Ищите что угодно на Bazaar",
                mainClass: TextFieldMainClass.BASE_SEARCH_INPUT,
            }),
            "orders-button": new Button({
                type: "success",
                title: "Заказы",
                isDisabled: false,
                iconAlt: "Иконка коробки для товаров",
                iconSrc: "src/shared/images/header-orders-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => { console.log('orders menu opened!') }
            }),
            "saved-button": new Button({
                type: "success",
                title: "Избранное",
                isDisabled: false,
                iconAlt: "Иконка сердечка",
                iconSrc: "src/shared/images/header-saved-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => { console.log('saved menu opened!') }
            }),
            "cart-button": new Button({
                type: "success",
                title: "Корзина",
                isDisabled: false,
                iconAlt: "Иконка корзины",
                iconSrc: "src/shared/images/header-cart-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => { console.log('cart menu opened!') }
            }),
            "profile-button": new Button({
                type: "success",
                title: !this.state.user ? "Войти" : "Выйти",
                isDisabled: false,
                iconAlt: "Иконка человечка",
                iconSrc: "src/shared/images/header-profile-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => {
                    if (this.state.user) {
                        this.logoutUser();
                    } else {
                        this.showPage("/login");
                    }
                }
            }),
        }
        return super.renderElement(context, this.#props, components);
    }

    getProps() {
        return this.#props;
    }

}

export default Header;
