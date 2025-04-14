import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";
import { getAllOrders } from "../../api/order";
import { AJAXErrors } from "../../api/errors";

class OrdersPage extends Tarakan.Component {
    state = {
        items: []
    }

    async fetchOrders() {
        const response = await getAllOrders();
        if (response.code === AJAXErrors.NoError) {
            this.setState({ items: response.orders });
        }
    }

    init() {
        this.fetchOrders();
    }

    render() {
        return <div className="orders-page">
            <Header />
            <main className="orders-page__main">
                <h1>Мои заказы</h1>
                <div className="orders-page__main__content">
                    <div className="orders-page__main__content__list">
                        {this.state.items.map((item, index, items) =>
                            <article className="orders-page__main__content__list__item">
                                <div className="orders-page__main__content__list__item__title">
                                    <h2>Заказ #{index + 1}</h2>
                                    <span className="orders-page__main__content__list__item__title__statuses">
                                        <span className="orders-page__main__content__list__item__title__statuses__status">
                                            Ожидает подтверждение
                                        </span>
                                        <span className="orders-page__main__content__list__item__title__statuses__date">
                                            Привезём через 5 рабочих дней
                                        </span>
                                    </span>
                                </div>
                                <div className="orders-page__main__content__list__item__images">
                                    {item.products.map((image: string) =>
                                        <img className="orders-page__main__content__list__item__images__img" src={image} />
                                    )}
                                </div>
                                <div className="orders-page__main__content__list__item__info">
                                    <div className="orders-page__main__content__list__item__info__item">
                                        <span style="color: gray">Общая сумма: </span>{item.price} ₽
                                    </div>
                                    <div className="orders-page__main__content__list__item__info__item">
                                        <span style="color: gray">Адрес доставки: </span>{item.addressName}
                                    </div>
                                </div>
                                {index !== items.length - 1 && <hr className="orders-page__main__content__list__item__sep" />}
                            </article>
                        )}
                        {
                            this.state.items.length === 0 && <div className="empty-cart">
                                <i>Вы пока ничего не заказывали</i>&#128521;
                            </div>
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default OrdersPage;