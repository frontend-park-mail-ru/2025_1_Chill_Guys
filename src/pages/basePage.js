class BasePage {
    constructor(templateName) {
        this.templateName = templateName;
    }

    render(props) {
        const template = Handlebars.templates[this.templateName];
        return template(props);
    }

    cleanUp() { }
}

export default BasePage;