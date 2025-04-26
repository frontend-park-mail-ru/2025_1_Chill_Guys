import Tarakan from "bazaar-tarakan";
import "./styles.scss";

class CSAT extends Tarakan.Component {

    state = {
        frame: null
    }

    renderFinished(iframeContainer: HTMLIFrameElement) {
        iframeContainer.onload = () => {
            const survey = iframeContainer.contentWindow.document.body.querySelector(".survey");
            const onResize = () => {
                iframeContainer.style.height = survey.scrollHeight + 'px';
                iframeContainer.style.width = survey.scrollWidth + 'px';
            }
            new ResizeObserver(() => onResize()).observe(survey)
            onResize();
        }

        window.addEventListener('message', (event: any) => {
            console.log(event);
            if (event.data === "finish") {
                iframeContainer.style.display = "none";
                if (this.props.onEnd) this.props.onEnd();
            }
        });

        this.setState({ frame: iframeContainer });
    }

    update(props) {
        this.state.frame.src = `/csat/${props.id}`;
        this.state.frame.style.display = "block";
    }

    render(props) {
        return <iframe src={`/csat/${props.id}`} />
    }
}

export default CSAT;