import Tarakan from "bazaar-tarakan";

import "./styles.scss";

import crossIcon from "../../shared/images/cross-ico.svg";
import Button from "../Button/Button";
import { ProductRequest, UserRequest } from "../../api/admin";
import { Product } from "../../api/product";
import { convertMoney } from "../../pages/AdminPage/AdminPage";

class ProductRequestModal extends Tarakan.Component {
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
        const request: Product = props.request;
        return <div className="request-modal">
            <div className={"request-modal__tint " + this.state.status} onClick={() => this.handleClose()} />
            <div className={"request-modal__content " + this.state.status}>
                <div className="request-modal__content__title">
                    <div className="request-modal__content__title__h">
                        Заявка
                    </div>
                    <div className="request-modal__content__title__close">
                        <img
                            className="alert__title__close__img"
                            src={crossIcon}
                            onClick={() => this.handleClose()} />
                    </div>
                </div>
                <div className="request-modal__content__data">
                    <div className="request-modal__content__data__icon">
                        <img className="request-modal__content__data__icon__img" src={request?.image} />
                    </div>
                    <div className="request-modal__content__data__item">
                        <div className="request-modal__content__data__item__name">
                            Название
                        </div>
                        <div className="request-modal__content__data__item__value">
                            {request?.name}
                        </div>
                    </div>
                    <div className="request-modal__content__data__item">
                        <div className="request-modal__content__data__item__name">
                            Описание
                        </div>
                        <div className="request-modal__content__data__item__value">
                            {request?.description}
                        </div>
                    </div>
                    <div className="request-modal__content__data__item">
                        <div className="request-modal__content__data__item__name">
                            Цена
                        </div>
                        <div className="request-modal__content__data__item__value">
                            {convertMoney(request?.price ?? 0)}
                        </div>
                    </div>
                </div>
                <div className="request-modal__content__actions">
                    <Button title="Одобрить товар" onClick={() => props.onSuccess()} />
                    <Button title="Отказать" variant="text" onClick={() => props.onDenied()} />
                </div>
            </div>
        </div>
    }
}

export default ProductRequestModal;