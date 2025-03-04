import BaseComponent from "../baseComponent.js"

class Button extends BaseComponent {
    #props = {}

    constructor(props) {
        super("button/button");
        this.#props = props;
    }

    render(context) {
        const element = super.renderElement(context, {
            type: this.#props.type,
            title: this.#props.title,
            isDisabled: this.#props.disabled ? "disabled" : ""
        }, {});

        element.addEventListener("click", this.#props.onClick);

        return element;
    }

    getProps() {
        return this.#props;
    }
}

export default Button