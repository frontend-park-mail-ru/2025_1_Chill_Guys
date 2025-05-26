import Tarakan from "bazaar-tarakan";
import "./styles.scss";

import invalidIcon from "../../shared/images/textfield-invalid.svg";
import successIcon from "../../shared/images/textfield-success.svg";
import validate from "bazaar-validation";

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
};

class TextField extends Tarakan.Component {
    init(initProps: any) {
        this.state = {
            status: "default",
            value: initProps.value,
            manuallyChanged: true,
        };
    }

    handleEnterFinish() {
        if (this.props.validType !== undefined) {
            const dataOk =
                this.props.validType !== undefined
                    ? validate(this.props.validType, this.state.value)
                    : true;
            // // console.log(this.props.validType, this.state.value, dataOk);
            if (dataOk) {
                this.setState({ status: "success" });
            } else {
                this.setState({ status: "invalid" });
            }
            if (this.props.onEnd) this.props.onEnd(dataOk, this.state.value);
        } else {
            if (this.props.onEnd) this.props.onEnd(true, this.state.value);
        }

    }

    handleChange(event: any) {
        this.setState({ value: event.target.value });
        if (this.props.onChange) this.props.onChange(event);
    }

    handleFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    update(props: any) {
        if (props.value) {
            this.setState({ value: props.value }, true);
        }
        if (props.status) {
            this.setState({ status: props.status }, true);
        }
    }

    changeStatus(newStatus: string) {
        this.setState({ status: newStatus });
    }

    render(props: any) {
        const type = props.type ?? TEXTFIELD_TYPES.TEXT;
        const placeholder = props.title ?? "Поле ввода";
        const defaultValue = props.value ?? "";
        const otherClasses = props.className ?? "";
        const title = props.fieldName ?? "";
        const isDisabled = props.isDisabled ?? false;

        console.log(this.state);

        return title ? (
            <div className={`textField_title ${otherClasses}`.trim()}>
                {title && <h3 className="textField_title__title">{title}</h3>}
                <div className="textField">
                    <input
                        className={`textField__input textField__input_${(props.validType !== undefined || this.state.manuallyChanged) ? this.state.status : "default"}`}
                        type={type}
                        placeholder={placeholder}
                        value={defaultValue}
                        disabled={isDisabled}
                        onFocus={() => this.handleFocus()}
                        onChange={(event: any) => this.handleChange(event)}
                        onBlur={() => this.handleEnterFinish()}
                        onEnd={(ev) => props.onEnter && props.onEnter(ev)}
                        maxLength={props.maxLength ?? "255"}
                        cols={props.cols}
                        min={props.min}
                        max={props.max}
                    />
                    {((props.validType !== undefined || this.state.manuallyChanged)
                        ? this.state.status
                        : "default") !== "default" && (
                            <img
                                className="textField__mark"
                                src={
                                    this.state.status === "success"
                                        ? successIcon
                                        : invalidIcon
                                }
                            />
                        )}
                </div>
            </div>
        ) : (
            <div className={`textField ${otherClasses}`.trim()}>
                <input
                    className={`textField__input textField__input_${(props.validType !== undefined || this.state.manuallyChanged) ? this.state.status : "default"}`}
                    type={type}
                    placeholder={placeholder}
                    value={defaultValue}
                    disabled={isDisabled}
                    onFocus={() => this.handleFocus()}
                    onChange={(event: any) => this.handleChange(event)}
                    onBlur={() => this.handleEnterFinish()}
                    onEnd={(ev) => props.onEnter && props.onEnter(ev)}
                    maxLength={props.maxLength ?? "255"}
                    cols={props.cols}
                    min={props.min}
                    max={props.max}
                />
                {((props.validType !== undefined || this.state.manuallyChanged)
                    ? this.state.status
                    : "default") !== "default" && (
                        <img
                            className="textField__mark"
                            src={
                                this.state.status === "success"
                                    ? successIcon
                                    : invalidIcon
                            }
                        />
                    )}
            </div>
        );
    }
}

export default TextField;
