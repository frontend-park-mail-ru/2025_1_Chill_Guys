import Tarakan from "bazaar-tarakan";
import "./styles.scss";

import homeIcon from "../../shared/images/home-ico.svg";

class AddressCard extends Tarakan.Component {
    render(props: any) {
        return <div className={`address-card${props.active ? " address-card_active" : ""}`} onClick={() => props.onClick && props.onClick()}>
            <img className="address-card__icon" src={homeIcon} />
            <div className="address-card__description">
                <div className="address-card__title">{props.name}</div>
                <div className="address-card__address">{props.address}</div>
            </div>
        </div>
    }
}

export default AddressCard;