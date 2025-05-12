import Tarakan from "bazaar-tarakan";
import "./styles.scss";

class AdBanner extends Tarakan.Component {
    renderFinished(container: HTMLDivElement) {
        new ResizeObserver(() => {
            const iframe: HTMLIFrameElement =
                container.firstChild as HTMLIFrameElement;
            iframe.style.scale = `${container.clientWidth / 300}`;
            iframe.style.marginBottom = `${container.clientWidth - 300}px`;
        }).observe(container);
    }

    render(props) {
        return (
            <div className="ad">
                <iframe src={props.url} width="300px" height="300px" />
                <div className="ad__text">Реклама</div>
            </div>
        );
    }
}

export default AdBanner;
