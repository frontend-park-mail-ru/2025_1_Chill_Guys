import Tarakan from "bazaar-tarakan";
import Button from "../Button/Button";

import crossIcon from "../../shared/images/cross-ico.svg";

import "./styles.scss";

class Alert extends Tarakan.Component {
    renderFinished(container: HTMLDivElement) {
        container.style.animation = " 0.2s showing-animation linear"
    }

    render(props) {
        return <div className="alert">
            <div className="alert__title">
                <div className="alert__title__h">
                    {props.title}
                </div>
                <div className="alert__title__close">
                    <img className="alert__title__close__img" src={crossIcon} onClick={() => props.onSuccess && props.onClose()} />
                </div>
            </div>
            <div className="alert__content">
                {props.content}
            </div>
            <div className="alert__actions">
                <Button title={props.successButtonTitle ?? "ОК"} variant="primary" onClick={() => props.onSuccess && props.onSuccess()} />
            </div>
        </div>
    }
}

export default Alert;