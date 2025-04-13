import Tarakan from "../../../modules/tarakan";
import "./styles.scss";

class PaymentType extends Tarakan.Component {
    render(props) {
        return <div
            className={`payment-type${props.disabled ? " disabled" : ""}${props.active ? " active" : ""}`}
        >
            <img className="icon" src={props.icon} />
            <div className="description">
                <div className="title">{props.name}</div>
                {props.disabled && <div className="disabled">Недоступно</div>}
            </div>
        </div>
    }
}

export default PaymentType;