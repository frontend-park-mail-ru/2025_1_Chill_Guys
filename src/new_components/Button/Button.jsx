import Tarakan from "../../../modules/tarakan.js";
import "./styles.scss";

class Button extends Tarakan.Component {
    render(props) {
        const size = props.size ?? "l";
        const variant = props.variant ?? "primary";
        const iconPosition = props.iconPosition ?? "left";
        const otherClasses = props.className ?? "";

        return <button
            type="button"
            className={`button ${size}_size ${variant} ${iconPosition} ${otherClasses}`.trim()}
            onClick={(event) => props.onClick ? props.onClick(event) : {}}
        >
            {
                props.iconSrc && <img alt={`${iconAlt}`} src={`${iconSrc}`} class="icon" />
            }
            <span>{props.title}</span>
        </button>
    }
}

export default Button;