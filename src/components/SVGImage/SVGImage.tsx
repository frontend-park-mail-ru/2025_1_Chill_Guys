import Tarakan from "bazaar-tarakan";
import "./styles.scss";

class SVGImage extends Tarakan.Component {
    state = {
        container: null,
    };

    async renderFinished(container) {
        const res = await fetch(this.props.src);
        const element = document.createElement("div");
        element.innerHTML = await res.text();
        const newContainer: any = element.firstChild;
        newContainer.classList.add(...this.props.className.trim().split(" "));
        container.replaceWith(newContainer);
        this.setDOM(newContainer);
        this.setState({ container: newContainer }, false);
    }

    async update() {
        const res = await fetch(this.props.src);
        const newContainer = (this.state.container.outerHTML =
            await res.text());
        // newContainer.className = this.props.className;
        this.setDOM(newContainer);
        this.state.container.className = `${this.state.container.className} ${this.props.className}`;
    }

    render() {
        return <div />;
    }
}

export default SVGImage;
