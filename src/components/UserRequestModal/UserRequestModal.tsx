import Tarakan from "bazaar-tarakan";

import "./styles.scss";

import crossIcon from "../../shared/images/cross-ico.svg";
import Button from "../Button/Button";
import { ProductRequest, UserRequest } from "../../api/admin";

class UserRequestModal extends Tarakan.Component {
    state = {
        container: null,
        status: "closed"
    }

    handleOpen() {
        this.setState({ status: "opened" });
    }

    handleClose() {
        this.setState({ status: "closed" });
    }

    renderFinished(container: HTMLElement) {
        this.setState({ container }, true);
    }

    render(props) {
        console.log(props);
        const request: UserRequest = props.request;
        return <div className="product-modal">
            <div className={"product-modal__tint " + this.state.status} onClick={() => this.handleClose()} />
            <div className={"product-modal__content " + this.state.status}>
                <div className="product-modal__content__title">
                    <div className="product-modal__content__title__h">
                        Заявка
                    </div>
                    <div className="product-modal__content__title__close">
                        <img
                            className="alert__title__close__img"
                            src={crossIcon}
                            onClick={() => this.handleClose()} />
                    </div>
                </div>
                <div className="product-modal__content__data">
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Название продукта
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.sellerInfo.title}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Описание компании
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.sellerInfo.description}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Владелец
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {`${request?.surname} ${request?.name}`.trim()}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Email владельца
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.email}
                        </div>
                    </div>
                </div>
                <div className="product-modal__content__actions">
                    <Button title="Одобрить заявку" onClick={() => props.onSuccess()} />
                    <Button title="Отказать" variant="text" onClick={() => props.onDenied()} />
                </div>
            </div>
        </div>
    }
}

export default UserRequestModal;
