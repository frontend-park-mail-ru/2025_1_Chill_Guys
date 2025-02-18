class BaseComponent {
    constructor(templateName){
        //this.parent = parent
        this.templateName = templateName
    }

    render(props){
        console.log(Handlebars.templates)
        const template = Handlebars.templates[`${this.templateName}`]
        return template(props)
    }
}

export default BaseComponent