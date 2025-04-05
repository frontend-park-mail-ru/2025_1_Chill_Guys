import Tarakan from "../../../modules/tarakan";
import Button from "../../new_components/Button/Button.jsx";
import { SERVER_URL } from "../../settings";
import "./styles.scss";

import cartBuyIcon from "../../shared/images/cart-buy-ico.svg";
import cartLoveIcon from "../../shared/images/cart-love-ico.svg";
import cartRemoveIcon from "../../shared/images/cart-remove-ico.svg";

import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";
import ajax from "../../../modules/ajax.js";
import Header from "../../new_components/Header/Header.jsx";
import Footer from "../../new_components/Footer/Footer.jsx";

class CartPage extends Tarakan.Component {

    state = {
        items: [],
        total: 0,
        discount: 0,
    }

    async fetchBasket() {
        const response = await ajax.get("api/basket/", {
            origin: SERVER_URL,
        });

        if (response.result.ok) {
            const data = await response.result.json();

            this.setState({
                items: data.products.map((item) => ({
                    id: item.product_id,
                    name: item.product_name,
                    image: item.product_image,
                    price: item.price_discount,
                    oldPrice: item.product_price,
                    quantity: item.quantity,
                })),
                total: data.total_price,
                discount: data.total_price_discount,
            });
        }
    }

    async handleUpdateQuantity(productIndex, countOffset) {
        const product = this.state.items[productIndex];

        if (product.quantity + countOffset == 0) {
            this.handleDelete(productIndex);
            return;
        }

        const response = await ajax.put("api/basket/update", {
            product_id: product.id,
            quantity: product.quantity + countOffset,
        }, {
            origin: SERVER_URL,
        });

        if (response.result.ok) {
            product.quantity = product.quantity + countOffset;
            this.setState({
                total: this.state.total + product.oldPrice * countOffset,
                discount: this.state.discount + product.price * countOffset,
            });
        }
    }

    async handleDelete(productIndex) {
        const product = this.state.items[productIndex];
        const response = await ajax.del("api/basket/remove", {
            product_id: product.id,
        }, {
            origin: SERVER_URL,
        });

        if (response.result.ok) {
            this.setState({
                items: [
                    ...this.state.items.slice(0, productIndex),
                    ...this.state.items.slice(productIndex + 1)
                ],
                total: this.state.total - product.oldPrice * product.quantity,
                discount: this.state.discount - product.price * product.quantity,
            });
        }
    }

    init() {
        this.fetchBasket();
    }

    render(props, router) {
        return <div className="cart-page">
            <Header />
            <main>
                <h1>Моя корзина</h1>
                <div className="content">
                    <div className="list">
                        {this.state.items.map((item, index) =>
                            <article className="item">
                                <img className="cover" src={`${SERVER_URL}/api/products/${item.id}/cover`} />
                                <div className="description">
                                    <div className="title">
                                        <div className="name">{item.name}</div>
                                        <div className="price">
                                            <span className="now">{item.price} ₽</span>
                                            <span className="old">{item.oldPrice} ₽</span>
                                            <span className="discount">{-parseInt((item.oldPrice - item.price) / item.oldPrice * 100)}%</span>
                                        </div>
                                        <div className="actions">
                                            <Button
                                                disabled={item.quantity > 0}
                                                size="s"
                                                iconSrc={cartSubIcon}
                                                onClick={() => this.handleUpdateQuantity(index, -1)}
                                            />
                                            <span className="count">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                size="s"
                                                iconSrc={cartAddIcon}
                                                onClick={() => this.handleUpdateQuantity(index, 1)}
                                            />
                                        </div>
                                    </div>
                                    <div className="manage">
                                        <Button className="icon-btn" size="s" iconSrc={cartLoveIcon} />
                                        <Button
                                            className="icon-btn"
                                            size="s"
                                            iconSrc={cartRemoveIcon}
                                            onClick={() => this.handleDelete(index)}
                                        />
                                        <Button className="btn" title="Купить" size="s" iconSrc={cartBuyIcon} />
                                    </div>
                                </div>
                            </article>
                        )}
                        {
                            this.state.items.length === 0 && <div className="empty-cart">
                                <i>Вы пока ничего не добавили в корзину</i>&#128521;
                            </div>
                        }
                    </div>
                    <div className="total">
                        <Button
                            className="make-order"
                            title="Оформление заказа"
                            onClick={() => router.navigateTo("/place-order")}
                        />
                        <div className="comment">
                            Способы оплаты и доставки будут доступны на следующем шаге
                        </div>
                        <div className="discount">
                            <span>Скидка:</span>
                            <span className="cost">{this.state.total - this.state.discount} ₽</span>
                        </div>
                        <div className="sum-cost">
                            <span>Итог:</span>
                            <span className="cost">{this.state.discount} ₽</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default CartPage;