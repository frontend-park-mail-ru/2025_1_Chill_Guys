'use strict';

import BaseComponent from "../baseComponent.js";

class ButtonWithIcon extends BaseComponent {
    constructor() {
        super("button_with_icon/button_with_icon");
    }

    render(props) {
        const element = super.render({
            type: props.type,
            title: props.title,
            isDisabled: props.disabled ? "disabled" : "",
            iconAlt: props.iconAlt,
            iconSrc: props.iconSrc,
        });
        element.addEventListener("click", props.onClick);
        return element;
    }
}

export default ButtonWithIcon
