import validate from "../../../modules/validation.js";
import BaseComponent from "../baseComponent.js"
import TextField from "../textField/textField.js";

class Form extends BaseComponent {
    #formTemplate   // Шаблон формы
    #formValue      // Значение полей формы

    /**
     * @param {Array<{ type: String, id: String, name: String, defaultValue: String?, validType: VALID_TYPES?, errorMessage: String? }>} template Поля формы
     */
    constructor(template) {
        super("form/form");
        this.#formTemplate = template;
        this.#formValue = {};
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
                title: field.name,
                defaultValue: field.defaultValue
            });
            this.#formValue[field.id] = field.defaultValue ?? "";
        });

        return super.renderElement(context, {
            form: this.#formTemplate
        }, components);
    }

    /** 
     * Функция для валидации данных формы. Если валидация пройдена, функция возвращает значения полей, иначе false.
     * @returns {{fieldId: String} | Boolean}
     */
    validate() {
        let ok = true;
        this.#formTemplate.forEach(({ id, validType, errorMessage }) => {
            const field = this.children[`f_${id}`];
            // Проверяем, что установлена валидация для данного поля (validType был задан) и поле не скрыто.
            // Тогда если не пройдена валидация, то устанавливаем флаг и выводим ошибку
            if (validType != undefined && !validate(validType, field.getValue())) {
                ok = false;
                field.markError(errorMessage)
            } else {
                field.markError("");
            }
        });
        return ok ? this.#formValue : false;
    }
}

export default Form