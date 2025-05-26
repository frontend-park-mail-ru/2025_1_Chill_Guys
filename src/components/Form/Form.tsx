import Tarakan from "bazaar-tarakan";
import validate from "bazaar-validation";
import TextField from "../TextField/TextField";
class Form extends Tarakan.Component {
    deepProps = ["form"];

    init(initProps: any) {
        const initForm = {};

        initProps.form.forEach((field: any) => {
            if (field.defaultValue !== "") {
                initForm[field.id] = field.defaultValue;
            }
        });

        this.state = {
            invalidFields: {},
            form: initForm,
        };
    }

    validate() {
        let invalidField = "";
        this.props.form.forEach((field: any, index: any) => {
            const fieldOk =
                field.validType !== undefined
                    ? validate(field.validType, this.state.form[field.id] ?? "")
                    : true;
            if (!fieldOk) {
                invalidField ||= field.id;
            }
            this.setState(
                {
                    invalidFields: {
                        ...this.state.invalidFields,
                        [field.id]: !fieldOk,
                    },
                    form: {
                        ...this.state.form,
                        [field.id]: this.state.form[field.id] ?? "",
                    },
                },
                index !== this.props.form.length - 1,
            );
        });
        if (this.props.onEnd) this.props.onEnd(invalidField);
        return invalidField === "" ? this.state.form : false;
    }

    setFieldStatus(field: any, isInvalid: any) {
        this.setState({
            invalidFields: {
                ...this.state.invalidFields,
                [field]: isInvalid,
            },
        });
    }

    handleChange(event: any) {
        this.setState({ value: event.target.value });
    }

    handleFocus(field: any) {
        if (this.props.onFieldFocus) this.props.onFieldFocus(field);
    }

    handleFieldEnd(id: any, isSuccess: any, fieldValue: any) {
        this.setState(
            {
                invalidFields: {
                    ...this.state.invalidFields,
                    [id]: !isSuccess,
                },
                form: {
                    ...this.state.form,
                    [id]: fieldValue,
                },
            },
            true,
        );

        let invalidField = "";
        this.props.form.forEach((field: any) => {
            const fieldOk =
                field.validType !== undefined
                    ? validate(field.validType, this.state.form[field.id] ?? "")
                    : true;
            if (!fieldOk && this.state.invalidFields[field.id] !== undefined) {
                invalidField ||= field.id;
            }
        });
        if (this.props.onEnd) this.props.onEnd(invalidField);
    }

    render(props) {
        const otherClasses = props.className ?? "";
        return (
            <div className={`${otherClasses}`.trim()}>
                {props.form.map((formField: any) => (
                    <TextField
                        type={formField.type}
                        validType={formField.validType}
                        title={formField.title}
                        value={formField.defaultValue ?? ""}
                        status={
                            this.state.invalidFields[formField.id] !== undefined
                                ? !this.state.invalidFields[formField.id]
                                    ? "success"
                                    : "invalid"
                                : "default"
                        }
                        onFocus={() => this.handleFocus(formField.id)}
                        onEnd={(isSuccess: any, fieldValue: any) =>
                            this.handleFieldEnd(
                                formField.id,
                                isSuccess,
                                fieldValue,
                            )
                        }
                    />
                ))}
            </div>
        );
    }
}

export default Form;
