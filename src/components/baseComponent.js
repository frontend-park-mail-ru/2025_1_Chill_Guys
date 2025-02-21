class BaseComponent {
    constructor(templateName) {
        //this.parent = parent
        this.templateName = templateName
    }

    render(props) {
        console.log(Handlebars.templates)
        const template = Handlebars.templates[`${this.templateName}`]
        const parser = new DOMParser();
        const doc = parser.parseFromString(template(props), 'text/html')
        return doc.body.firstChild;
    }
}

export default BaseComponent