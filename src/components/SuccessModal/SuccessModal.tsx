import Tarakan from "bazaar-tarakan";
import Button from "../Button/Button";

import "./styles.scss";

class SuccessModal extends Tarakan.Component {
    state = {
        opened: false,
    };

    update(newPropes: any) {
        this.setState({ opened: newPropes.opened });
    }

    render(props: any, app: any) {
        return (
            <div className="success-modal">
                <div className="success-modal__modal-shadow"></div>
                <div className="success-modal__modal-content">
                    <h2>Заказ успешно оформлен</h2>
                    <Button
                        title="Вернутся на главную страницу"
                        onClick={() => app.navigateTo("/")}
                    />
                </div>
            </div>
        );
    }
}

export default SuccessModal;
