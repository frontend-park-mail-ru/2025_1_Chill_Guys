"use strict";

import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";
import BaseComponent from "../baseComponent.js";
import Button, { ICON_POSITION } from "../button/button.js";
import TextField, { TextFieldMainClass } from "../textField/textField.js";

import headerTemplate from "./header.hbs";

import catalogButtonIcon from "/src/shared/images/catalog-button-ico.svg";
import ordersButtonIcon from "/src/shared/images/header-orders-ico.svg";
import savedButtonIcon from "/src/shared/images/header-saved-ico.svg";
import cartButtonIcon from "/src/shared/images/header-cart-ico.svg";
import profileButtonIcon from "/src/shared/images/header-profile-ico.svg";

class Header extends BaseComponent {
  #props = {};

  constructor(props) {
    super(headerTemplate);
    this.#props = props;
  }

  /**
   * Хранит состояние шапки:
   * - user: Параметры пользователя. Если user = null, то пользователь не залогинился (или происходит обращение к серверу).
   */
  state = {
    user: null,
  };

  /**
   * Инициализация компоненты
   */
  initState() {
    this.fetchUser();
  }

  /**
   * Получение информации о пользователе
   */
  async fetchUser() {
    const res = await ajax.get("api/users/me", { origin: SERVER_URL });

    if (res.result?.status === 200) {
      const user = await res.result.json();
      this.setState({ user });
    }
  }

  /**
   * Выход пользователя из аккаунта
   */
  async logoutUser() {
    const res = await ajax.post("api/auth/logout", {}, { origin: SERVER_URL });

    if (res.result?.status === 200) {
      this.setState({ user: null });
    }
  }

  /**
   * Функция генерации шапки
   * @returns {HTMLElement}
   */
  render(context) {
    const components = {
      "catalog-button": new Button({
        type: "success",
        title: "Каталог",
        isDisabled: false,
        iconAlt: "Иконка каталога",
        iconSrc: catalogButtonIcon,
        size: "l",
        onClick: () => { },
      }),
      "main-search-input": new TextField({
        type: "search",
        placeholder: "Ищите что угодно на Bazaar",
        mainClass: TextFieldMainClass.BASE_SEARCH_INPUT,
        otherClasses: "tf__type__input__width__400",
      }),
      "orders-button": new Button({
        type: "success",
        title: "Заказы",
        isDisabled: false,
        iconAlt: "Иконка коробки для товаров",
        iconSrc: ordersButtonIcon,
        iconPosition: ICON_POSITION.TOP,
        otherClasses: "header-nav-button",
        size: "l",
        onClick: () => {
          console.log("orders menu opened!");
        },
      }),
      "saved-button": new Button({
        type: "success",
        title: "Избранное",
        isDisabled: false,
        iconAlt: "Иконка сердечка",
        iconSrc: savedButtonIcon,
        iconPosition: ICON_POSITION.TOP,
        otherClasses: "header-nav-button",
        size: "l",
        onClick: () => {
          console.log("saved menu opened!");
        },
      }),
      "cart-button": new Button({
        type: "success",
        title: "Корзина",
        isDisabled: false,
        iconAlt: "Иконка корзины",
        iconSrc: cartButtonIcon,
        iconPosition: ICON_POSITION.TOP,
        otherClasses: "header-nav-button",
        size: "l",
        onClick: () => {
          console.log("cart menu opened!");
        },
      }),
      "profile-button": new Button({
        type: "success",
        title: !this.state.user ? "Войти" : "Выйти",
        isDisabled: false,
        iconAlt: "Иконка человечка",
        iconSrc: profileButtonIcon,
        iconPosition: ICON_POSITION.TOP,
        otherClasses: "header-nav-button",
        size: "l",
        onClick: () => {
          if (this.state.user) {
            this.logoutUser();
          } else {
            this.showPage("/login");
          }
        },
      }),
    };
    return super.renderElement(context, this.#props, components);
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default Header;
