import BaseComponent from "../baseComponent.js"

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
    #elements = {
        inputElement: null,
        errorElement: null
    };
    #props = {}

    constructor(props) {
        super("textField/textField");
        this.#props = props;
    }

    render(context) {
        const element = super.renderElement(context, {
            type: this.#props.type,
            placeholder: this.#props.placeholder ?? "",
            mainClass: this.#props.mainClass ?? TextFieldMainClass.BASE_INPUT
        }, {});

        this.#elements.inputElement = element.querySelector(".tf__input");
        this.#elements.errorElement = element.querySelector(".tf__error");

        this.#elements.inputElement.value = this.#props.defaultValue ?? "";
        this.#elements.inputElement.addEventListener("input", this.#props.onChange);

        return element;
    }

    markError(error) {
        this.#elements.errorElement.hidden = !error;
        this.#elements.errorElement.innerText = error;

        if (error) {
            this.#elements.inputElement.classList.add("tf__input__error");
        } else {
            this.#elements.inputElement.classList.remove("tf__input__error");
        }
    }

    setValue(value) {
        this.#elements.inputElement.value = value;
    }

    getValue() {
        return this.#elements.inputElement.value;
    }

    getProps() {
        return this.#props;
    }
}

export default TextField;