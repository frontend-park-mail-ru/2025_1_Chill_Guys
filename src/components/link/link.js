'use strict';

import BaseComponent from "../baseComponent.js";

class Link extends BaseComponent {
  #props = {};

  /**
   * @param {{ title: String, onChange: (event: MouseEvent) => {} }} props Параметры ссылки
   */
  constructor(props) {
    super("link/link");
    this.#props = props;
  }

  /**
   * Функция генерации ссылки
   * @returns {HTMLElement}
   */
  render(context) {
    const element = super.renderElement(
      context,
      {
        title: this.#props.title,
      },
      {},
    );
    element.addEventListener("click", this.#props.onClick);
    return element;
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default Link;
