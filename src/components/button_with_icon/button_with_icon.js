'use strict';

import BaseComponent from "../baseComponent.js";

export const ICON_POSITION = {
    TOP: "button__orientation__top",
    RIGHT: "button__orientation__right",
    BOTTOM: "button__orientation__bottom",
    LEFT: "button__orientation__left",
}

class ButtonWithIcon extends BaseComponent {
    #props = {}

    constructor(props) {
        super("button_with_icon/button_with_icon");
        this.#props = props;
    }

    /**
     *
     * Кнопка с иконкой или без неё.
     *
     * @param props
     *  - iconSrc: Путь до иконки для кнопки. Будет установлен в атрибут src.
     *             Если пустой, то иконки не будет (будет просто текст).
     *  - iconPosition: Расположение кнопки относительно текста [см. ICON_POSITION].
     *  - iconAlt: Атрибут alt для иконки.
     *  - title: Текст на самой кнопке
     *  - isDisabled: Активна/Не активна.
     *  - mainClass: Основной окрас кнопки.
     *  - otherClasses: Строка со стилями, разделенными пробелами.
     * @returns {*}
     */
    render(context) {
        const element = super.renderElement(context, {
            isDisabled: this.#props.disabled ? "disabled" : "",
            size: this.#props.size,
            otherClasses: this.#props.otherClasses,
            title: this.#props.title,
            iconAlt: this.#props.iconAlt,
            iconSrc: this.#props.iconSrc,
            iconPosition: this.#props.iconPosition || ICON_POSITION.LEFT,
        }, {});
        element.addEventListener("click", this.#props.onClick);
        return element;
    }
}

export default ButtonWithIcon
