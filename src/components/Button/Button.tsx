import Tarakan from "bazaar-tarakan";
import "./styles.scss";

export const ICON_POSITION = {
    TOP: "top",
    RIGHT: "right",
    BOTTOM: "bottom",
    LEFT: "left",
};

export const BUTTON_VARIANT = {
    TEXT: "text",
    PRIMARY: "primary",
    TRANSPARENT: "transparent",
};

export const BUTTON_SIZE = {
    XS: "xs",
    S: "s",
    M: "m",
    L: "l",
};

class Button extends Tarakan.Component {
    render(props: any) {
        const size = props.size ?? BUTTON_SIZE.L;
        const variant = props.variant ?? BUTTON_VARIANT.PRIMARY;
        const iconPosition = props.iconPosition ?? ICON_POSITION.LEFT;
        const otherClasses = props.className ?? "";

        return <button
            type="button"
            disabled={this.props.disabled}
            className={`button button_${size}_size button_${variant} button_${iconPosition} ${otherClasses}`.trim()}
            onClick={(event: any) => props.onClick ? props.onClick(event) : {}}
            onMouseOver={(event: any) => props.onMouseOver ? props.onMouseOver(event) : {}}
            onMouseLeave={(event: any) => props.onMouseLeave ? props.onMouseLeave(event) : {}}
        >
            {
                props.iconSrc && <img alt={`${props.iconAlt}`} src={`${props.iconSrc}`} className={`icon icon_${size}_size`} />
            }
            {props.title && <span>{props.title}</span>}
        </button>
    }
}

export default Button;