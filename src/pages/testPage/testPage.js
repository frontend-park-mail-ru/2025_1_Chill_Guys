import BasePage from "../basePage.js";
import Button from "../../components/button/button.js";
import Header from "../../components/header/header.js"
import Footer from "../../components/footer/footer.js"
import TextField from "../../components/textField/textField.js";
import Form from "../../components/form/form.js";
import { VALID_TYPES } from "../../../modules/validation.js";

class TestPage extends BasePage {
    constructor(props) {
        super("testPage/testPage");
    }

    state = {
        count: 0,
    }

    render(context) {
        return super.renderElement(context, { title: this.state.title }, {
            "header": new Header({}),
            "footer": new Footer({}),
            "add": new Button({
                type: "success",
                title: "Добавить",
                onClick: () => this.setState({ count: this.state.count + 1 }),
            }),
            "remove": new Button({
                type: "dangerous",
                title: "Удалить",
                disabled: this.state.count === 0,
                onClick: () => this.setState({ count: this.state.count - 1 })
            }),
            "list": Array(this.state.count).fill(0).map((E, I) => new Button({ type: "primary", title: `Кнопка_${I}` })),
        })
    }
}

export default TestPage;