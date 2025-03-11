"use strict";

import BaseComponent from "../baseComponent.js";

class TemplateComponent extends BaseComponent {
  #props = {};

  constructor(props) {
    super(props.template);
    this.#props = props;
  }

  /**
   * Функция генерации карточки товара
   * @returns {HTMLElement}
   */
  render(context) {
    return super.renderElement(context, this.#props, {});
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default TemplateComponent;
