import Tarakan from "../../../modules/tarakan";
import Button from "../Button/Button";

import "./styles.scss";

class SuccessModal extends Tarakan.Component {
    state = {
        opened: false
    }

    update(newPropes) {
        this.setState({ opened: newPropes.opened });
    }

    render(props, app) {
        return <div className="success-modal">
            <div className="modal-shadow"></div>
            <div className="modal-content">
                <h2>Заказ успешно оформлен</h2>
                <Button title="Вернутся на главную страницу" onClick={() => app.navigateTo("/")} />
            </div>
        </div>
    }
}

export default SuccessModal;