'use strict';

import BaseComponent from "../baseComponent.js";
import ButtonWithIcon, {ICON_POSITION} from "../button_with_icon/button_with_icon.js";
import TextField from "../textField/textField.js";

class Header extends BaseComponent {
    #elements

    #props = {}

    constructor(props) {
        super("header/header");
        this.#props = props;
    }

    render(context) {
        const components = {
            "catalog-button": new ButtonWithIcon({
                type: "success",
                title: "Каталог",
                isDisabled: false,
                iconAlt: "Иконка каталога",
                iconSrc: "src/shared/images/catalog-button-ico.svg",
                onClick: () => {console.log('hello, world!')},
            }),
            "main-search-input": new TextField({
                type: "text",
                title: "Ищите что угодно на Bazaar",
            }),
            "orders-button": new ButtonWithIcon({
                type: "success",
                title: "Заказы",
                isDisabled: false,
                iconAlt: "Иконка коробки для товаров",
                iconSrc: "src/shared/images/header-orders-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => {console.log('orders menu opened!')}
            }),
            "saved-button": new ButtonWithIcon({
                type: "success",
                title: "Избранное",
                isDisabled: false,
                iconAlt: "Иконка сердечка",
                iconSrc: "src/shared/images/header-saved-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => {console.log('saved menu opened!')}
            }),
            "cart-button": new ButtonWithIcon({
                type: "success",
                title: "Корзина",
                isDisabled: false,
                iconAlt: "Иконка корзины",
                iconSrc: "src/shared/images/header-cart-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => {console.log('cart menu opened!')}
            }),
            "profile-button": new ButtonWithIcon({
                type: "success",
                title: "Профиль",
                isDisabled: false,
                iconAlt: "Иконка человечка",
                iconSrc: "src/shared/images/header-profile-ico.svg",
                iconPosition: ICON_POSITION.TOP,
                otherClasses: "header-nav-button",
                size: "l",
                onClick: () => {console.log('profile menu opened!')}
            }),
        }
        return super.renderElement(context, this.#props, components);
    }

}

export default Header;
