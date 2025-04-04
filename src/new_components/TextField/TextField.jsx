import Tarakan from "../../../modules/tarakan.js";
import "./styles.scss";

import invalidIcon from "../../shared/images/textfield-invalid.svg";
import successIcon from "../../shared/images/textfield-success.svg"
import validate, { VALID_TYPES } from "../../../modules/validation.js";


export const TEXTFIELD_TYPES = {
    SEARCH: "search",
    TEXT: "text",
    INPUT: "input",
    EMAIL: "email",
    NUMBER: "number",
    FILE: "file",
    SUBMIT: "submit",
    TIME: "time",
    BUTTON: "button",
    HIDDEN: "hidden",
}

class TextField extends Tarakan.Component {

    init(initProps) {
        this.state = {
            status: "default",
            value: initProps.value,
        }
    }

    handleEnterFinish() {
        const dataOk = this.props.validType !== undefined ? validate(this.props.validType, this.state.value) : true;
        if (dataOk) {
            this.setState({ status: "success" });
        } else {
            this.setState({ status: "invalid" });
        }
        if (this.props.onEnd) this.props.onEnd(dataOk, this.state.value);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleFocus() {
        if (this.props.onFocus) this.props.onFocus();
    }

    update(props) {
        this.setState({ status: props.status }, true);
    }

    render(props) {
        const type = props.type ?? TEXTFIELD_TYPES.TEXT;
        const placeholder = props.title ?? "Поле ввода";
        const defaultValue = props.value ?? "";
        const otherClasses = props.className ?? "";

        return <div className={`textField ${otherClasses}`.trim()}>
            <input
                className={this.state.status}
                type={type}
                placeholder={placeholder}
                value={defaultValue}

                onFocus={() => this.handleFocus()}
                onChange={(event) => this.handleChange(event)}
                onBlur={() => this.handleEnterFinish()}
            />
            {this.state.status !== "default" &&
                <img class="mark" src={this.state.status === "success" ? successIcon : invalidIcon} />
            }
        </div>
    }
}

export default TextField;