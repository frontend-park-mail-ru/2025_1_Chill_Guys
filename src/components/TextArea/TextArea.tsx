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

class TextArea extends Tarakan.Component {
    init(initProps: any) {
        this.state = {
            status: "default",
            value: initProps.value,
        };
    }

    handleEnterFinish() {
        const dataOk =
            this.props.validType !== undefined
                ? validate(this.props.validType, this.state.value)
                : true;
        if (dataOk) {
            this.setState({ status: "success" });
        } else {
            this.setState({ status: "invalid" });
        }
        if (this.props.onEnd) this.props.onEnd(dataOk, this.state.value);
    }

    handleChange(event: any) {
        this.setState({ value: event.target.value });
        if (this.props.onChange) this.props.onChange(event);
    }

    handleFocus() {
        if (this.props.onFocus) this.props.onFocus();
    }

    update(props: any) {
        if (props.value) {
            this.setState({ value: props.value }, true);
        }
        if (props.status) {
            this.setState({ status: props.status }, true);
        }
    }

    render(props: any) {
        const placeholder = props.title ?? "Поле ввода";
        const defaultValue = props.value ?? "";
        const otherClasses = props.className ?? "";
        const title = props.fieldName ?? "";
        const isDisabled = props.isDisabled ?? false;

        return title ? (
            <div className={`textArea_title ${otherClasses}`.trim()}>
                {title && <h3 className="textArea_title__title">{title}</h3>}
                <div className="textArea">
                    <textarea
                        className={`textArea__input textArea__input_${props.validType !== undefined ? this.state.status : "default"}`}
                        placeholder={placeholder}
                        value={defaultValue}
                        disabled={isDisabled}
                        onFocus={() => this.handleFocus()}
                        onChange={(event: any) => this.handleChange(event)}
                        onBlur={() => this.handleEnterFinish()}
                        rows={props.rows}
                    />
                    {(props.validType !== undefined
                        ? this.state.status
                        : "default") !== "default" && (
                        <img
                            className="textArea__mark"
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
            <div className={`textArea ${otherClasses}`.trim()}>
                <textarea
                    className={`textArea__input textArea__input_${props.validType !== undefined ? this.state.status : "default"}`}
                    placeholder={placeholder}
                    value={defaultValue}
                    disabled={isDisabled}
                    onFocus={() => this.handleFocus()}
                    onChange={(event: any) => this.handleChange(event)}
                    onBlur={() => this.handleEnterFinish()}
                    rows={props.rows}
                />
                {(props.validType !== undefined
                    ? this.state.status
                    : "default") !== "default" && (
                    <img
                        className="textArea__mark"
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

export default TextArea;
