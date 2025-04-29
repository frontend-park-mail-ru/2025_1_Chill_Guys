import Tarakan from "bazaar-tarakan";
import "./styles.scss";

class InfinityList extends Tarakan.Component {
    renderFinished(container: any): void {
        const observer = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                this.props.onShow();
                return
            }
        }, {
            root: null,
            threshold: 0.1,
        })

        observer.observe(container);
    }

    render() {
        return <div className="infinity-list"></div>
    }
}

export default InfinityList;