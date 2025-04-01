import Tarakan from "../../../modules/tarakan.js";
import "./styles.scss";

import invalidIcon from "../../shared/images/textfield-invalid.svg";
import successIcon from "../../shared/images/textfield-success.svg"
import validate, { VALID_TYPES } from "../../../modules/validation.js";

class TextField extends Tarakan.Component {
    state = {
        status: "default",
        value: "",
    }

    handleEnterFinish() {
        console.log(this.props.validType)
        const dataOk = this.props.validType !== undefined ? validate(this.props.validType, this.state.value) : true;
        if (dataOk) {
            this.setState({ status: "success" });
        } else {
            this.setState({ status: "invalid" });
        }
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render(props) {
        const type = props.type ?? "text";
        const placeholder = props.title ?? "Поле ввода";
        const defaultValue = props.value ?? "";
        const otherClasses = props.className ?? "";

        return <div className={`textField ${otherClasses}`.trim()}>
            <input
                className={this.state.status}
                type={type}
                placeholder={placeholder}
                value={defaultValue}
                onChange={(event) => this.handleChange(event)}
                onEnd={() => this.handleEnterFinish()}
            />
            {this.state.status !== "default" &&
                <img class="mark" src={this.state.status === "success" ? successIcon : invalidIcon} />
            }
        </div>
    }
}

export default TextField;