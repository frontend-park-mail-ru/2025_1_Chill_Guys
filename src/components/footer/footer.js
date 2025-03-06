'use strict';

import BaseComponent from "../baseComponent.js";

class Footer extends BaseComponent {
    #props = {}

    constructor(props) {
        super("footer/footer");
        this.#props = props;
    }

    render(context) {
        return this.renderElement(context, this.#props, {});
    }

    getProps() {
        return this.#props;
    }
}

export default Footer;