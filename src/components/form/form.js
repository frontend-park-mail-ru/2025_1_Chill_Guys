'use strict';

import validate from "../../../modules/validation.js";
import BaseComponent from "../baseComponent.js";
import TextField from "../textField/textField.js";

class Form extends BaseComponent {
  #formTemplate; // Шаблон формы
  #formValue; // Значение полей формы
  #props;

  /**
   * @param {Array<{ type: String, id: String, name: String, defaultValue: String?, validType: VALID_TYPES?, errorMessage: String? }>} template Поля формы
   */
  constructor(props, template) {
    super("form/form");
    this.#formTemplate = template;
    this.#formValue = {};
    this.#props = props;
  }

  /**
   * Функция генерации формы
   * @returns {HTMLElement}
   */
  render(context) {
    const components = {};

    this.#formTemplate.forEach((field) => {
      components[`f_${field.id}`] = new TextField({
        type: field.type,
        placeholder: field.name,
        defaultValue: field.defaultValue,
        validType: field.validType,
        onChange: (event) => {
          this.#formValue[field.id] = event.target.value;
          this.#props.onChange(field.id, event);
        },
        onFinish: (valid) => this.#props.onFinish(field.id, valid),
      });
      this.#formValue[field.id] = field.defaultValue ?? "";
    });

    return super.renderElement(
      context,
      {
        form: this.#formTemplate,
        otherClasses: this.#props.otherClasses,
      },
      components,
    );
  }

  /**
   * Функция для валидации данных формы. Если валидация пройдена, функция возвращает значения полей, иначе false.
   * @returns {{fieldId: String} | Boolean}
   */
  validate() {
    let ok = true;
    this.#formTemplate.forEach(({ id, validType }) => {
      const field = this.children[`f_${id}`];
      // Проверяем, что установлена валидация для данного поля (validType был задан) и поле не скрыто.
      // Тогда если не пройдена валидация, то устанавливаем флаг и выводим ошибку
      if (validType != undefined && !validate(validType, field.getValue())) {
        field.markError(true);
        ok = false;
      } else {
        field.markError(false);
      }
    });
    return ok ? this.#formValue : false;
  }

  /**
   * Помечает конкретное поле ошибкой (или скрывает её)
   * @param {String} fieldId ID поля
   * @param {boolean} needShow Показать ли ошибку
   * @param {boolean} ignoreSending Вызывать ли фукнцию onFinish у поля ввода
   */
  markError(fieldId, needShow, ignoreSending) {
    this.children[`f_${fieldId}`].markError(needShow, ignoreSending);
  }

  /**
   * Возравщает props компоненты
   * @returns {object}
   */
  getProps() {
    return this.#props;
  }
}

export default Form;
