'use strict';

import BaseComponent from "../baseComponent.js";

export const ICON_POSITION = {
    TOP: "button__orientation__top",
    RIGHT: "button__orientation__right",
    BOTTOM: "button__orientation__bottom",
    LEFT: "button__orientation__left",
}

class ButtonWithIcon extends BaseComponent {
    constructor() {
        super("button_with_icon/button_with_icon");
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
    render(props) {
        const element = super.render({
            isDisabled: props.disabled ? "disabled" : "",
            mainClass: props.mainClass,
            otherClasses: props.otherClasses,
            title: props.title,
            iconAlt: props.iconAlt,
            iconSrc: props.iconSrc,
            iconPosition: props.iconPosition || ICON_POSITION.LEFT,
        });
        element.addEventListener("click", props.onClick);
        return element;
    }
}

export default ButtonWithIcon
