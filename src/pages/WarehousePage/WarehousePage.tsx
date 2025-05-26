import Tarakan from "bazaar-tarakan";
import Footer from "../../components/Footer/Footer";
import WarehouseHeader from "../../components/WarehouseHeader/WarehouseHeader";
import Button from "../../components/Button/Button";

import ArrowDown from "../../shared/images/arrow-down-invert.svg";

import { getWarehouseOrders, sendWarehouseOrder, WarehouseOrder, WarehouseOrderProduct } from "../../api/warehouse";
import { AJAXErrors } from "../../api/errors";

import "./styles.scss";

function getCount(number: number) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return "товаров";
    }
    n %= 10;
    if (n === 1) {
        return "товар";
    }
    if (n >= 2 && n <= 4) {
        return "товара";
    }
    return "товаров";
}

class WarehousePage extends Tarakan.Component {
    state: { orders: WarehouseOrder[], activeOrder?: WarehouseOrder } = {
        orders: [],
        activeOrder: null,
    }

    async getOrders() {
        const { code, data } = await getWarehouseOrders();
        if (code === AJAXErrors.NoError) {
            this.setState({ orders: data });
        } else {
            this.app.navigateTo("/");
        }
    }

    async sendOrder(orderId: string) {
        const code = await sendWarehouseOrder(orderId);
        if (code === AJAXErrors.NoError) {
            this.setState({ orders: this.state.orders.filter((order) => order.id !== orderId), activeOrder: null });
        }
    }

    init() {
        this.getOrders();
    }

    render() {
        return <div className="warehouse-page">
            <WarehouseHeader />
            <main className="warehouse-page__content">
                <h1 className="warehouse-page__content__h">Все заказы</h1>
                <div className="warehouse-page__content__orders">
                    {this.state.orders.map((order: WarehouseOrder) =>
                        <div className={
                            order.id === this.state.activeOrder?.id
                                ? "warehouse-page__content__orders__item opened"
                                : "warehouse-page__content__orders__item"
                        }>
                            <div className="warehouse-page__content__orders__item__title" onClick={
                                () => this.setState({
                                    activeOrder: this.state.activeOrder?.id !== order.id ? order : null
                                })
                            }>
                                <div className="warehouse-page__content__orders__item__title__button">
                                    <img src={ArrowDown} />
                                </div>
                                <div className="warehouse-page__content__orders__item__title__name">
                                    <span style="color: #666">
                                        Заказ
                                    </span> {order.id}
                                </div>
                                <div className="warehouse-page__content__orders__item__title__count">
                                    {order.products.length} {getCount(order.products.length)}
                                </div>
                            </div>
                            <div className="warehouse-page__content__orders__item__body">
                                <div className="warehouse-page__content__orders__item__body__content">
                                    <p className="warehouse-page__content__orders__item__body__content__h">
                                        Товары заказа:
                                    </p>
                                    <div className="warehouse-page__content__orders__item__body__content__items">
                                        {order.products.map((product: WarehouseOrderProduct) =>
                                            <div className="warehouse-page__content__orders__item__body__content__items__product">
                                                <div className="warehouse-page__content__orders__item__body__content__items__product__content" onClick={() => window.open("/product/" + product.id)}>
                                                    <img
                                                        src={product.imageUrl}
                                                        className="warehouse-page__content__orders__item__body__content__items__product__content__img"
                                                    />
                                                    <div className="warehouse-page__content__orders__item__body__content__items__product__content__block">
                                                        <div className="warehouse-page__content__orders__item__body__content__items__product__content__desc">
                                                            <div className="warehouse-page__content__orders__item__body__content__items__product__content__desc__t">
                                                                Название товара:
                                                            </div>
                                                            <div className="warehouse-page__content__orders__item__body__content__items__product__content__desc__v">
                                                                {product.name}
                                                            </div>
                                                        </div>
                                                        <div className="warehouse-page__content__orders__item__body__content__items__product__content__count">
                                                            <div className="warehouse-page__content__orders__item__body__content__items__product__content__count__t">
                                                                Количество:
                                                            </div>
                                                            <div className="warehouse-page__content__orders__item__body__content__items__product__content__count__v">
                                                                {product.quantity} шт
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        )}
                                    </div>
                                    <p className="warehouse-page__content__orders__item__body__content__address">
                                        Адрес доставки:
                                    </p>
                                    <div className="warehouse-page__content__orders__item__body__content__address-v">
                                        {order.addressString}
                                    </div>
                                    <Button
                                        className="warehouse-page__content__orders__item__body__content__send"
                                        variant="primary"
                                        size="m"
                                        title="Отправить заказ"
                                        onClick={() => this.sendOrder(order.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main >
            <Footer />
        </div >

    }
}

export default WarehousePage;