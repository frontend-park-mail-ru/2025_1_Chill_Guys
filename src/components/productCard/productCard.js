"use strict";

import BaseComponent from "../baseComponent.js";
import Button, {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_POSITION,
} from "../button/button.js";

class ProductCard extends BaseComponent {
  #props = {};

  /**
   * Конструктор.
   *
   * @param props
   * - mainImageAlt: Альтернативный текст для главной картинки.
   * - mainImageSrc: Путь до главной картинки товара.
   * - price: Цена с примененной скидкой.
   * - oldPrice: Сарая цена (до скидки).
   * - sale: Скидка в процентах (будет отрендерина как -sale%).
   * - brand: Название брэнда товара.
   * - title: Название товара.
   * - rating: Оценка на основе отзывов. Будет отрендерина с точностью 1 знак после запятой.
   * - reviewsCount: количество отзывов.
   */
  constructor(props) {
    super("productCard/productCard");
    this.#props = props;
  }

  /**
   * Функция генерации карточки товара
   * @returns {HTMLElement}
   */
  render(context) {
    return this.renderElement(context, this.#props, {
      "buy-button": new Button({
        isDisabled: false,
        size: BUTTON_SIZE.L,
        variant: BUTTON_VARIANT.PRIMARY,
        iconPosition: ICON_POSITION.LEFT,
        otherClasses: "buy-button-card",
        iconAlt: "Иконка корзины",
        iconSrc: "/src/shared/images/productCard-cart-ico.svg",
        title: "В корзину",
      }),
    });
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default ProductCard;
