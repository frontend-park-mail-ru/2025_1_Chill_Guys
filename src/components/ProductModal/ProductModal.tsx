import Tarakan from "bazaar-tarakan";

import "./styles.scss";

import crossIcon from "../../shared/images/cross-ico.svg";
import Button from "../Button/Button";
import { ProductRequest, UserRequest } from "../../api/admin";
import { Product } from "../../api/product";
import { convertMoney } from "../../pages/AdminPage/AdminPage";

class ProductModal extends Tarakan.Component {
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
        const request: Product = props.product;
        return <div className="product-modal">
            <div className={"product-modal__tint " + this.state.status} onClick={() => this.handleClose()} />
            <div className={"product-modal__content " + this.state.status}>
                <div className="product-modal__content__title">
                    <div className="product-modal__content__title__h">
                        Информация о товаре
                    </div>
                    <div className="product-modal__content__title__close">
                        <img
                            className="alert__title__close__img"
                            src={crossIcon}
                            onClick={() => this.handleClose()} />
                    </div>
                </div>
                <div className="product-modal__content__data">
                    <div className="product-modal__content__data__icon">
                        <img className="product-modal__content__data__icon__img" src={request?.image} />
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Название
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.name}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Описание
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.description}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Цена
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {convertMoney(request?.price ?? 0)}
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Наличие
                        </div>
                        <div className="product-modal__content__data__item__value">
                            {request?.quantity} шт
                        </div>
                    </div>
                    <div className="product-modal__content__data__item">
                        <div className="product-modal__content__data__item__name">
                            Статус
                        </div>
                        <div className="product-modal__content__data__item__value">
                            <span className={"product-modal__content__data__item__value__status " + request?.status}>{
                                {
                                    "pending": "Ожидание одобрения",
                                    "empty": "Товар закончился",
                                    "approved": "В продаже",
                                    "rejected": "Отказано"
                                }[request?.status]
                            }</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default ProductModal;