import Tarakan from "../../../modules/tarakan.js";
import "./styles.scss";

export const ICON_POSITION = {
    TOP: "button__orientation__top",
    RIGHT: "button__orientation__right",
    BOTTOM: "button__orientation__bottom",
    LEFT: "button__orientation__left",
};

export const BUTTON_VARIANT = {
    TEXT: "text",
    PRIMARY: "primary",
};

export const BUTTON_SIZE = {
    XS: "xs",
    S: "s",
    M: "m",
    L: "l",
};

class Button extends Tarakan.Component {
    render(props) {
        const size = props.size ?? BUTTON_SIZE.L;
        const variant = props.variant ?? BUTTON_VARIANT.PRIMARY;
        const iconPosition = props.iconPosition ?? ICON_POSITION.LEFT;
        const otherClasses = props.className ?? "";

        return <button
            type="button"
            className={`button ${size}_size ${variant} ${iconPosition} ${otherClasses}`.trim()}
            onClick={(event) => props.onClick ? props.onClick(event) : {}}
        >
            {
                props.iconSrc && <img alt={`${props.iconAlt}`} src={`${props.iconSrc}`} class="icon" />
            }
            <span>{props.title}</span>
        </button>
    }
}

export default Button;