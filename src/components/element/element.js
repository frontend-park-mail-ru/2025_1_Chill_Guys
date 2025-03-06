import BaseComponent from "../baseComponent";

class Element extends BaseComponent {
    #props = {}

    constructor(props) {
        super(props.template);
        this.#props = props;
    }

    render(context) {
        return super.renderElement(context, this.#props, {});
    }

    getProps() {
        return this.#props;
    }
}

export default Element;