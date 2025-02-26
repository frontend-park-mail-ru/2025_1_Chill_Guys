import BaseComponent from "../baseComponent.js"

class Button extends BaseComponent {
    constructor() {
        super("button/button");
    }

    render(props) {
        const element = super.render({
            type: props.type,
            title: props.title,
            isDisabled: props.disabled ? "disabled" : ""
        });
        element.addEventListener("click", props.onClick);
        return element;
    }
}

export default Button