import BaseComponent from "../baseComponent.js"

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
            title: this.#props.title ?? "",
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