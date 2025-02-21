import BaseComponent from "../baseComponent.js"

class TextField extends BaseComponent {
    #elements = {
        inputElement: null,
        errorElement: null
    };

    constructor() {
        super("textField/textField");
    }

    render(props) {
        const element = super.render({
            name: props.name ?? "",
            dataType: props.type,
            title: props.title,
            placeholder: props.placeholder ?? "",
        });

        this.#elements.inputElement = element.querySelector(".tf__input");
        this.#elements.errorElement = element.querySelector(".tf__error");

        this.#elements.inputElement.value = props.defaultValue ?? "";
        this.#elements.inputElement.addEventListener("input", props.onChange);

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
}

export default TextField;