"use strict";

import BaseComponent from "../baseComponent.js";
import footerTemplate from "./footer.hbs";

/**
 * Подвал сайта
 */
class Footer extends BaseComponent {
  #props = {};

  constructor(props) {
    super(footerTemplate);
    this.#props = props;
  }

  /**
   * Функция генерации подвала
   * @returns {HTMLElement}
   */
  render(context) {
    return this.renderElement(context, this.#props, {});
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default Footer;
