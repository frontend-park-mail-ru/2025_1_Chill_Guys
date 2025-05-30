import Tarakan from "bazaar-tarakan";
import "./styles.scss";

class AdBanner extends Tarakan.Component {
    state = {
        link: null,
        error: false,
    };

    renderFinished(container: HTMLDivElement) {
        new ResizeObserver(() => {
            if (this.state.error) return;
            const iframe: HTMLIFrameElement =
                container.firstChild as HTMLIFrameElement;
            iframe.style.scale = `${container.clientWidth / 300}`;
            iframe.style.marginBottom = `${container.clientWidth - 300}px`;
        }).observe(container);

        const iframe: HTMLIFrameElement =
            container.firstChild as HTMLIFrameElement;
        iframe.addEventListener("load", () => {
            if (this.state.error) return;
            const link: any = iframe.contentWindow?.document
                .querySelectorAll("a[href]")
                .item(0);
            this.state.link = link;
            if (link === null) {
                this.setState({
                    error: true,
                });
            }
        });

        setTimeout(() => {
            if (!this.state.link) {
                this.setState({
                    error: true,
                });
            }
        }, 5000);
    }

    render(props) {
        return (
            <div
                className="ad"
                style={this.state.error ? "cursor: default;" : ""}
            >
                {!this.state.error ? (
                    <iframe src={props.url} width="300px" height="300px" />
                ) : (
                    <div className="ad__no_ad">
                        <div>Здесь могла быть ваша реклама</div>
                        <div>Звоните +7 (999)-999-99-99</div>
                    </div>
                )}
                <div className="ad__text">Реклама</div>
                <div
                    className="ad__click"
                    onClick={() =>
                        this.state.link && window.open(this.state.link)
                    }
                ></div>
            </div>
        );
    }
}

export default AdBanner;
