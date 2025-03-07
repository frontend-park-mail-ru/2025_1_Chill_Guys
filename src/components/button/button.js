'use strict';

import BaseComponent from "../baseComponent.js";

export const ICON_POSITION = {
    TOP: "button__orientation__top",
    RIGHT: "button__orientation__right",
    BOTTOM: "button__orientation__bottom",
    LEFT: "button__orientation__left",
};

export const BUTTON_VARIANT = {
    TEXT: "button__variant__text",
    PRIMARY: "button__variant__primary",
};

class Button extends BaseComponent {
    #props = {}

    /**
     * Конструктор.
     *
     * @param props - параметры рендера кнопки.
     *  - isDisabled: Активна/Не активна.
     *  - size: Размер кнопки: ["xs", "s", "m", "l"].
     *  - variant: Тип кнопки [TEXT - без фона, PRIMARY - с фоном].
     *  - otherClasses: Строка со стилями, разделенными пробелами.
     *  - iconPosition: Расположение кнопки относительно текста [см. ICON_POSITION].
     *  - iconAlt: Атрибут alt для иконки.
     *  - iconSrc: Путь до иконки для кнопки. Будет установлен в атрибут src.
     *             Если пустой, то иконки не будет (будет просто текст).
     *  - title: Текст на самой кнопке
     */
    constructor(props) {
        super("button/button");
        this.#props = props;
    }

    /**
     *
     * Кнопка с иконкой или без неё.
     *
     * @param contex
     *  - iconSrc: Путь до иконки для кнопки. Будет установлен в атрибут src.
     *             Если пустой, то иконки не будет (будет просто текст).
     *  - iconPosition: Расположение кнопки относительно текста [см. ICON_POSITION].
     *  - iconAlt: Атрибут alt для иконки.
     *  - title: Текст на самой кнопке
     *  - isDisabled: Активна/Не активна.
     *  - variant: Стиль кнопки (text или primary)
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
            variant: this.#props.variant || BUTTON_VARIANT.PRIMARY,
            iconAlt: this.#props.iconAlt,
            iconSrc: this.#props.iconSrc,
            iconPosition: this.#props.iconPosition || ICON_POSITION.LEFT,
        }, {});
        element.addEventListener("click", this.#props.onClick);
        return element;
    }

    getProps() {
        return this.#props;
    }
}

export default Button
