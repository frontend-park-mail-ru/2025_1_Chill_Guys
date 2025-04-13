import Tarakan from "../../../modules/tarakan";
import "./styles.scss";

import homeIcon from "../../shared/images/home-ico.svg";

class AddressCard extends Tarakan.Component {
    render(props) {
        return <div className={`address-card${props.active ? " active" : ""}`} onClick={() => props.onClick && props.onClick()}>
            <img className="icon" src={homeIcon} />
            <div className="description">
                <div className="title">{props.name}</div>
                <div className="address">{props.address}</div>
            </div>
        </div>
    }
}

export default AddressCard;