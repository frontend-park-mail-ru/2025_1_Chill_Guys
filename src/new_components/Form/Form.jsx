import Tarakan from "../../../modules/tarakan.js";
import TextField from "../TextField/TextField.jsx";
import "./styles.scss";

class Form extends Tarakan.Component {
    state = {
        form: {}
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render(props) {
        const otherClasses = props.className ?? "";

        return <div className={`${otherClasses}`.trim()}>
            {props.form.map((formField) =>
                <TextField validType={formField.validType} type={formField.type} title={formField.title} />
            )}
        </div>
    }
}

export default Form;