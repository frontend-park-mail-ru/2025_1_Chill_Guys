import Tarakan from "../../modules/tarakan";

export default class TestComponent extends Tarakan.Component {
    key = ""
    state = {
        value: ""
    }

    init() {
        this.key = `${parseInt(Math.random() * 1000)}`
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    render(props) {
        console.log(this.key, "updated!")

        return <div className="row">
            <input onChange={(ev) => this.handleChange(ev)} />
            <span>{this.state.value}</span>
        </div>
    }

}