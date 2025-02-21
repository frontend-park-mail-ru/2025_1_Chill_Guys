import validate from "../../../modules/validation.js";
import BaseComponent from "../baseComponent.js"

class Form extends BaseComponent {
    #formElement    // Главный элемент формы
    #formTemplate   // Шаблон формы
    #formActions    // Кнопки
    #formValue      // Значение полей формы

    /**
     * @param {Array<{ type: String, id: String, name: String, defaultValue: String?, validType: VALID_TYPES?, errorMessage: String? }>} template Поля формы
     * @param {Array<{ type: String, id: String, name: String }>} actions Кнопки формы
     */
    constructor(template, actions) {
        super("form/form");
        this.#formTemplate = template;
        this.#formActions = actions;
        this.#formValue = {};
    }

    /**
     * Функция генерации формы
     * @param {Function} handleAction Функция-обработчик для кнопок формы
     * @returns {HTMLElement}
     */
    render(handleAction) {
        this.#formElement = super.render({
            form: this.#formTemplate,
            actions: this.#formActions
        });

        // Заполняем начальными значениями поля ввода
        this.#formTemplate.forEach(({ id, defaultValue }) => {
            const inputElement = this.#formElement.querySelector(`.form__element__input[name=${id}]`);
            inputElement.value = defaultValue ?? "";
            this.#formValue[id] = defaultValue ?? "";
        });

        // Добавление обработчика изменения полей и нажатий на кнопки
        this.#formElement.addEventListener("input", (event) => this.#handleUpdateValue(event));
        this.#formElement.querySelector(".form__actions").addEventListener("click", (event) => handleAction(event.target.name));

        return this.#formElement;
    }

    /** 
     * Функция для валидации данных формы. Если валидация пройдена, функция возвращает значения полей, иначе false.
     * @returns {{fieldId: String} | Boolean}
     */
    validate() {
        let ok = true;
        this.#formTemplate.forEach(({ id, validType, errorMessage }) => {
            const inputElement = this.#formElement.querySelector(`.form__element__input[name=${id}]`);

            // Проверяем, что установлена валидация для данного поля (validType был задан) и поле не скрыто.
            // Тогда если не пройдена валидация, то устанавливаем флаг и выводим ошибку
            if (validType != undefined && !validate(validType, this.#formValue[id]) && !inputElement.hidden) {
                ok = false;
                this.#markError(id, errorMessage);
            } else {
                this.#markError(id, "");
            }
        });
        return ok ? this.#formValue : false;
    }

    /**
     * Скрывает определённые поля формы и выключает для них валидацию.
     * @param {Array<String>} fields Массив полей (их ID), которые необходимо скрыть.
     * 
     * @example
     * // Скроет поле repeat_password
     * form.hideFields(["repeat_password"]);
     */
    hideFields(fields) {
        fields.forEach((fieldId) => {
            this.#markError(fieldId, "");

            // Скрываем название и поле ввода
            this.#formElement.querySelector(`.form__element__title[name=${fieldId}]`).hidden = true;
            this.#formElement.querySelector(`.form__element__input[name=${fieldId}]`).hidden = true;
        });
    }

    /**
     * Меняет скрытось определённых полей формы на противоположную (скрытые станут отображаться, а не скрытые будут скрыты)
     * @param {Array<String>} fields Массив полей (их ID), скрытость которых необходимо изменить.
     * 
     * @example
     * // Изначально все поля не скрыты. 
     * // Поле repeat_password будет скрыто, а email останется не скрытым.
     * form.toogleFields(["email"]);
     * form.toogleFields(["email", "repeat_password"]);
     */
    toogleFields(fields) {
        fields.forEach((fieldId) => {
            this.#markError(fieldId, "");
            this.#formElement.querySelector(`.form__element__title[name=${fieldId}]`).hidden ^= true;
            this.#formElement.querySelector(`.form__element__input[name=${fieldId}]`).hidden ^= true;
        });
    }

    /**
     * Функция для получения элемента кнопки формы по её id
     * @param {String} actionId 
     * 
     * @example
     * const okButtonElement = form.actionElement("button_ok");
     * 
     * @returns {HTMLElement}
     */
    actionElement(actionId) {
        return this.#formElement.querySelector(`.form__actions > [name="${actionId}"]`);
    }

    /**
     * Обрабочкик изменения значений полей ввода формы
     * @param {KeyboardEvent} event Событие изменения значения поля ввода
     */
    #handleUpdateValue(event) {
        this.#formValue[event.target.name] = event.target.value;
    }

    /**
     * Фукнция для отображения ошибки для поля ввода. Если message = "", ошибка будет скрыта.
     * @param {String} id ID поля
     * @param {String} message Сообщение об ошибке
     */
    #markError(id, message) {
        const errorElement = this.#formElement.querySelector(`.form__element__error[name=${id}]`);
        errorElement.hidden = message == "";
        errorElement.innerText = message;
    }
}

export default Form