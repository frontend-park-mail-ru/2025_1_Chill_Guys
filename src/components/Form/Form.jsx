import Tarakan from "../../../modules/tarakan.js";
import validate from "../../../modules/validation.js";
import TextField from "../TextField/TextField.jsx";
import "./styles.scss";

class Form extends Tarakan.Component {

    deepProps = ["form"];

    init(initProps) {
        const initForm = {};

        initProps.form.forEach((field) => {
            if (field.defaultValue !== "") {
                initForm[field.id] = field.defaultValue;
            }
        })

        this.state = {
            invalidFields: {},
            form: initForm
        }
    }

    validate() {
        let invalidField = "";
        this.props.form.forEach((field, index) => {
            const fieldOk = field.validType !== undefined ? validate(field.validType, this.state.form[field.id] ?? "") : true;
            if (!fieldOk) {
                invalidField ||= field.id;
            }
            this.setState({
                invalidFields: {
                    ...this.state.invalidFields,
                    [field.id]: !fieldOk
                },
                form: {
                    ...this.state.form,
                    [field.id]: this.state.form[field.id] ?? "",
                }
            }, index !== this.props.form.length - 1);
        });
        if (this.props.onEnd) this.props.onEnd(invalidField);
        return invalidField === "" ? this.state.form : false;
    }

    setFieldStatus(field, isInvalid) {
        this.setState({
            invalidFields: {
                ...this.state.invalidFields,
                [field]: isInvalid
            }
        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleFocus(field) {
        if (this.props.onFieldFocus) this.props.onFieldFocus(field);
    }

    handleFieldEnd(id, isSuccess, fieldValue) {
        this.setState({
            invalidFields: {
                ...this.state.invalidFields,
                [id]: !isSuccess
            },
            form: {
                ...this.state.form,
                [id]: fieldValue
            }
        }, true);

        let invalidField = "";
        this.props.form.forEach((field) => {
            const fieldOk = field.validType !== undefined ? validate(field.validType, this.state.form[field.id] ?? "") : true;
            if (!fieldOk && this.state.invalidFields[field.id] !== undefined) {
                invalidField ||= field.id;
            }
        });
        if (this.props.onEnd) this.props.onEnd(invalidField);
    }

    render(props) {
        const otherClasses = props.className ?? "";
        return <div className={`${otherClasses}`.trim()}>
            {props.form.map((formField) =>
                <TextField
                    type={formField.type}
                    validType={formField.validType}
                    title={formField.title}
                    value={formField.defaultValue ?? ""}
                    status={
                        this.state.invalidFields[formField.id] !== undefined ? (
                            !this.state.invalidFields[formField.id]
                                ? "success"
                                : "invalid"
                        ) : "default"
                    }
                    onFocus={() => this.handleFocus(formField.id)}
                    onEnd={(isSuccess, fieldValue) => this.handleFieldEnd(formField.id, isSuccess, fieldValue)}
                />
            )}
        </div>
    }
}

export default Form;