"use strict";

import validate from "../../../modules/validation.js";
import BaseComponent from "../baseComponent.js";

/**
 * Основные CSS классы для input полей.
 * @type {{}}
 */
export const TextFieldMainClass = {
  BASE_INPUT: "tf__type__input",
  CORRECT_INPUT: "tf__type__input__correct",
  INVALID_INPUT: "tf__type__input__invalid",
  BASE_SEARCH_INPUT: "tf__search__type__input",
};

class TextField extends BaseComponent {
  /**
   * Хранит дочерние элементы поля ввода
   */
  #elements = {
    inputElement: null,
  };

  /**
   * Параметры поля ввода
   */
  #props = {};

  /**
   * Состояние поля ввода:
   * - status: Вид поля ввода
   */
  state = {
    status: TextFieldMainClass.BASE_INPUT,
  };

  constructor(props) {
    super("textField/textField");
    this.#props = props;
  }

  /**
   * Функция генерации поля ввода
   * @returns {HTMLElement}
   */
  render(context) {
    const defaultValue =
      this.#elements.inputElement?.value ?? this.#props.defaultValue ?? "";

    const element = super.renderElement(
      context,
      {
        type: this.#props.type,
        placeholder: this.#props.placeholder ?? "",
        mainClass: this.state.status,
        defaultValue: this.#elements.inputElement?.value ?? "",
        icon:
          this.state.status == TextFieldMainClass.CORRECT_INPUT
            ? "/src/shared/images/textfield-success.svg"
            : "/src/shared/images/textfield-invalid.svg",
        showIcon: this.state.status != TextFieldMainClass.BASE_INPUT,
      },
      {},
    );

    this.#elements.inputElement = element.querySelector(".tf__input");
    if (this.elementChanged) {
      this.#elements.inputElement.value = defaultValue;
      this.#elements.inputElement.addEventListener(
        "input",
        this.#props.onChange,
      );
      this.#elements.inputElement.addEventListener("change", (ev) =>
        this.handleInputFinish(ev),
      );
    }

    return element;
  }

  /**
   * Вызывается при окончании ввода
   * @param {Event} ev Событие окончания ввода
   */
  handleInputFinish(ev) {
    const validData =
      this.#props.validType === undefined ||
      validate(this.#props.validType, ev.target.value);
    if (validData) {
      this.setState({ status: TextFieldMainClass.CORRECT_INPUT });
    } else {
      this.setState({ status: TextFieldMainClass.INVALID_INPUT });
    }
    this.#props.onFinish(validData);
  }

  /**
   * Помечает поле ввода как ошибочное (или скрывает ошибку)
   * @param {boolean} needShow Показывать ли ошибку
   * @param {boolean} ignoreSending Игнорировать вызов функции onFinish
   */
  markError(needShow, ignoreSending) {
    this.setState({
      status: needShow
        ? TextFieldMainClass.INVALID_INPUT
        : TextFieldMainClass.CORRECT_INPUT,
    });
    if (!ignoreSending) {
      this.#props.onFinish(!needShow);
    }
  }

  /**
   * Задаёт полю ввода определённое значение
   * @param {String} value Значение поля ввода
   */
  setValue(value) {
    this.#elements.inputElement.value = value;
  }

  /**
   * Возвращает значение поля ввода
   */
  getValue() {
    return this.#elements.inputElement.value;
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default TextField;
