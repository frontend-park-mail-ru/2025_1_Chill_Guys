import Tarakan from "../../../modules/tarakan";
import Button from "../../components/Button/Button.jsx";
// import { SERVER_URL } from "../../settings";
import "./styles.scss";

import cartBuyIcon from "../../shared/images/cart-buy-ico.svg";
import cartLoveIcon from "../../shared/images/cart-love-ico.svg";
import cartRemoveIcon from "../../shared/images/cart-remove-ico.svg";

import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";
// import ajax from "../../../modules/ajax.js";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";

import { getBasket, removeFromBasket, updateProductQuantity } from "../../api/basket";

import { AJAXErrors } from "../../api/errors";
import { saveOrderLocal } from "../../api/order";
import { SERVER_URL } from "../../settings";

class CartPage extends Tarakan.Component {

    state = {
        items: [],
        total: 0,
        discount: 0,
    }

    async fetchBasket() {
        const response = await getBasket();

        if (response.code === AJAXErrors.NoError) {
            const data = response.data;
            this.setState({
                items: data.products,
                total: data.totalPrice,
                discount: data.totalPriceDiscount,
            });
        }

        if (response.code === AJAXErrors.Unauthorized) {
            this.app.navigateTo("/login");
        }
    }

    async handleUpdateQuantity(productIndex, countOffset) {
        const product = this.state.items[productIndex];

        if (product.quantity + countOffset == 0) {
            this.handleDelete(productIndex);
            return;
        }

        const response = await updateProductQuantity(product.productId, product.quantity + countOffset);

        if (response.code === AJAXErrors.NoError) {
            product.quantity = product.quantity + countOffset;
            product.remainQuantity = response.remainQuantity;
            this.setState({
                total: this.state.total + product.productPrice * countOffset,
                discount: this.state.discount + product.priceDiscount * countOffset,
            });
        }
    }

    async handleDelete(productIndex) {
        const product = this.state.items[productIndex];
        const code = await removeFromBasket(product.productId);

        if (code === AJAXErrors.NoError) {
            this.setState({
                items: [
                    ...this.state.items.slice(0, productIndex),
                    ...this.state.items.slice(productIndex + 1)
                ],
                total: this.state.total - product.productPrice * product.quantity,
                discount: this.state.discount - product.priceDiscount * product.quantity,
            });
        }
    }

    async handleSaveFullBasket() {
        const code = await saveOrderLocal(this.state.items);
        if (code === AJAXErrors.NoError) {
            this.app.navigateTo("/place-order")
        }
    }

    async handleSaveOneProductToBasket(index) {
        const code = await saveOrderLocal([{ ...this.state.items[index], quantity: 1 }]);
        if (code === AJAXErrors.NoError) {
            this.app.navigateTo("/place-order")
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
                                <img className="cover" src={`${SERVER_URL}/${item.productImage}`} />
                                <div className="description">
                                    <div className="title">
                                        <div className="name">{item.productName}</div>
                                        <div className={`price${(item.productPrice - item.priceDiscount) != 0 ? " discount" : ""}`}>
                                            <span className="now">{item.priceDiscount} ₽</span>
                                            {(item.productPrice - item.priceDiscount) != 0 && <span className="discount">
                                                ({-parseInt((item.productPrice - item.priceDiscount) / item.productPrice * 100)}%)
                                            </span>}
                                        </div>
                                        <div className="actions">
                                            <Button
                                                size="s"
                                                iconSrc={cartSubIcon}
                                                onClick={() => this.handleUpdateQuantity(index, -1)}
                                            />
                                            <span className="count">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                disabled={item.remainQuantity === 0}
                                                size="s"
                                                iconSrc={cartAddIcon}
                                                onClick={() => this.handleUpdateQuantity(index, 1)}
                                            />
                                        </div>
                                    </div>
                                    <div className="manage">
                                        <Button
                                            className="icon-btn"
                                            size="s"
                                            iconSrc={cartRemoveIcon}
                                            onClick={() => this.handleDelete(index)}
                                        />
                                        <Button
                                            className="btn"
                                            title="Купить"
                                            size="s"
                                            iconSrc={cartBuyIcon}
                                            onClick={() => this.handleSaveOneProductToBasket(index)} />
                                        <div className="remainCount">
                                            Осталось {item.remainQuantity} шт
                                        </div>
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
                            onClick={() => this.handleSaveFullBasket()}
                            disabled={this.state.items.length == 0}
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