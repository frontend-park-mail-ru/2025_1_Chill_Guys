import Tarakan from "bazaar-tarakan";

import "./styles.scss";

import cartBuyIcon from "../../shared/images/cart-buy-ico.svg";
import cartRemoveIcon from "../../shared/images/cart-remove-ico.svg";
import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";

import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { AJAXErrors } from "../../api/errors";
import { getBasket, removeFromBasket, updateProductQuantity } from "../../api/basket";
import { saveOrderLocal } from "../../api/order";

class CartPage extends Tarakan.Component {

    state: any = {
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
            this.app.navigateTo("/signin");
        }
    }

    async handleUpdateQuantity(productIndex: any, countOffset: any) {
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

    async handleDelete(productIndex: any) {
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

    async handleSaveOneProductToBasket(index: any) {
        const code = await saveOrderLocal([{ ...this.state.items[index], quantity: 1 }]);
        if (code === AJAXErrors.NoError) {
            this.app.navigateTo("/place-order")
        }
    }

    init() {
        this.fetchBasket();
    }

    render() {
        return <div className="cart-page">
            <Header />
            <main>
                <h1>Моя корзина</h1>
                <div className="content">
                    <div className="content__list">
                        {this.state.items.map((item, index) =>
                            <article className={`content__list__item ${item.remainQuantity < 0 ? "content__list__item_ignore" : ""}`.trim()}>
                                <img className="content__list__item__cover" src={item.productImage} />
                                <div className="content__list__item__description">
                                    <div className="content__list__item__description__title">
                                        <div className="content__list__item__description__title__name">{item.productName}</div>
                                        <div className={`content__list__item__description__title__price${(item.productPrice - item.priceDiscount) != 0 ? " content__list__item__description__title__price_discount" : ""}`}>
                                            <span className="">{item.priceDiscount} ₽</span>
                                            {(item.productPrice - item.priceDiscount) != 0 && <span className="content__list__item__description__title__price_discount">
                                                ({-parseInt(`${(item.productPrice - item.priceDiscount) / item.productPrice * 100}`)}%)
                                            </span>}
                                        </div>
                                        <div className="content__list__item__description__title__actions">
                                            <Button
                                                disabled={item.remainQuantity < 0}
                                                size="s"
                                                iconSrc={cartSubIcon}
                                                onClick={() => this.handleUpdateQuantity(index, -1)}
                                            />
                                            <span className="content__list__item__description__title__actions__count">
                                                {item.remainQuantity < 0 ? 0 : item.quantity}
                                            </span>
                                            <Button
                                                disabled={item.remainQuantity === 0 || item.remainQuantity < 0}
                                                size="s"
                                                iconSrc={cartAddIcon}
                                                onClick={() => this.handleUpdateQuantity(index, 1)}
                                            />
                                        </div>
                                    </div>
                                    <div className="content__list__item__description__manage">
                                        <Button
                                            className="content__list__item__description__manage__icon-btn"
                                            size="s"
                                            iconSrc={cartRemoveIcon}
                                            onClick={() => this.handleDelete(index)}
                                        />
                                        <Button
                                            className="content__list__item__description__manage__btn"
                                            title="Купить"
                                            size="s"
                                            iconSrc={cartBuyIcon}
                                            disabled={item.remainQuantity < 0}
                                            onClick={() => this.handleSaveOneProductToBasket(index)} />
                                        <div className="content__list__item__description__manage__remainCount">
                                            {item.remainQuantity >= 0
                                                ? `Осталось ${item.remainQuantity} шт`
                                                : "Закончились"
                                            }
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
                    <div className="content__total">
                        <Button
                            className="content__total__make-order"
                            title="Оформление заказа"
                            onClick={() => this.handleSaveFullBasket()}
                            disabled={this.state.items.filter((basketItem) => basketItem.remainQuantity >= 0).length == 0}
                        />
                        <div className="content__total__comment">
                            Способы оплаты и доставки будут доступны на следующем шаге
                        </div>
                        <div className="content__total__discount">
                            <span>Скидка:</span>
                            <span className="content__total__discount__cost">{this.state.total - this.state.discount} ₽</span>
                        </div>
                        <div className="content__total__sum-cost">
                            <span>Итог:</span>
                            <span className="content__total__discount__cost">{this.state.discount} ₽</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default CartPage;