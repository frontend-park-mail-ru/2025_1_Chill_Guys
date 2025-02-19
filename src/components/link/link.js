import BaseComponent from "../baseComponent.js"

class Link extends BaseComponent{
    constructor(){
        super("link/link");
    }

    render(props){
        const element = super.render({
            title: props.title,
        });
        element.addEventListener("click", props.onClick);
        return element;
    }
}

export default Link