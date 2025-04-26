/*
    КОПИЯ ProductPage С ДРУГИМ ВАРИАНТОМ РАСПОЛОЖЕНИЯ ВИДЖЕТОВ
*/

import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./stylesTabs.scss";
import { getProduct } from "../../api/product";
import { AJAXErrors } from "../../api/errors";
import Button from "../../components/Button/Button";

import StarIcon from "../../shared/images/productCard-star-ico.svg";
import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";
import { addToBasket, getBasket, removeFromBasket, updateProductQuantity } from "../../api/basket";

class ProductPage extends Tarakan.Component {
    state: any = {
        product: null,
        comments: [
            {
                id: "comment",
                description: "Таким образом, курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации соответствующих условий активизации. Задача организации, в особенности же выбранный нами инновационный путь требует от нас анализа позиций, занимаемых участниками в отношении поставленных задач? Повседневная практика показывает, что выбранный нами инновационный путь создаёт предпосылки качественно новых шагов для дальнейших направлений развития проекта.",
                author: "Круглов Леонид",
                date: new Date(Date.parse("2025-04-20T18:25:55.280Z")),
                review: 4,
            },
            {
                id: "comment",
                description: "Таким образом, курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации соответствующих условий активизации. Задача организации, в особенности же выбранный нами инновационный путь требует от нас анализа позиций, занимаемых участниками в отношении поставленных задач? Повседневная практика показывает, что выбранный нами инновационный путь создаёт предпосылки качественно новых шагов для дальнейших направлений развития проекта.",
                author: "Мамаев Никита",
                date: new Date(Date.parse("2025-04-20T18:25:55.280Z")),
                review: 5,
            },
            {
                id: "comment",
                description: "Таким образом, курс на социально-ориентированный национальный проект влечет за собой процесс внедрения и модернизации соответствующих условий активизации. Задача организации, в особенности же выбранный нами инновационный путь требует от нас анализа позиций, занимаемых участниками в отношении поставленных задач? Повседневная практика показывает, что выбранный нами инновационный путь создаёт предпосылки качественно новых шагов для дальнейших направлений развития проекта.",
                author: "Марков Михаил",
                date: new Date(Date.parse("2025-04-20T18:25:55.280Z")),
                review: 3,
            }
        ],
        menuOpened: "reviews",
    }

    async fetchProduct() {
        const productId = this.app.urlParams.productId;
        const { code: basketCode, data } = await getBasket();
        let quantity = 0;

        if (basketCode === AJAXErrors.NoError) {
            for (const item of data.products) {
                if (item.productId === productId) {
                    quantity = item.quantity;
                    break;
                }
            }
        }

        const { code: productCode, product } = await getProduct(productId);

        if (productCode === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...product,
                    quantity,
                }
            });
        } else {
            this.app.navigateTo("/");
        }
    }

    handleClickTab(name: any) {
        this.setState({
            menuOpened: name,
        });
    }

    async handleAddProduct() {
        let code = 0;

        if (this.state.product.quantity === 0) {
            code = await addToBasket(this.state.product.id);
        } else {
            code = (await updateProductQuantity(this.state.product.id, this.state.product.quantity + 1)).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.state.product,
                    quantity: this.state.product.quantity + 1,
                }
            });
        }
    }

    async handleRemoveProduct() {
        let code = 0;

        if (this.state.product.quantity === 1) {
            code = await removeFromBasket(this.state.product.id);
        } else {
            code = (await updateProductQuantity(this.state.product.id, this.state.product.quantity - 1)).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.state.product,
                    quantity: this.state.product.quantity - 1,
                }
            });
        }
    }

    init() {
        if (this.app.urlParams.productId) {
            this.fetchProduct();
        } else {
            this.app.navigateTo("/");
        }
    }

    render() {
        return <div className="product-page">
            <Header />
            <main className="product-page__main">
                <div className="product-page__main__card">
                    <div className="product-page__main__card__image">
                        <img src={`${this.state.product?.image}`} />
                    </div>
                    <div className="product-page__main__card__details">
                        <h1>{this.state.product?.name}</h1>
                        <div className="product-page__main__card__details__buyer">
                            ООО "Клуб анонимных фронтендеров и бекэндеров"
                        </div>
                        {this.state.product && <div className="product-page__main__card__details__action">
                            <span className={`product-page__main__card__details__action__price${this.state.product.discountPrice !== 0 ? "-discount" : "-default"}`}>
                                80 000 ₽
                            </span>
                            {
                                this.state.product.discountPrice !== 0 &&
                                <span className="product-page__main__card__details__action__discount">
                                    (-{parseInt(`${(this.state.product.price - this.state.product.discountPrice) / this.state.product.price * 100}`)}%)
                                </span>
                            }
                            <div className="product-page__main__card__details__action__buy">
                                <Button
                                    disabled={this.state.product.quantity === 0}
                                    size="m"
                                    iconSrc={cartSubIcon}
                                    className="no-text"
                                    onClick={() => this.handleRemoveProduct()}
                                />
                                <Button
                                    disabled={this.state.product.remainQuantity ?? 0 < 0}
                                    size="m"
                                    title={
                                        this.state.product.quantity === 0
                                            ? "Добавить в корзину"
                                            : `Добавлено ${this.state.product.quantity} шт`
                                    }
                                    className={
                                        this.state.product.quantity !== 0
                                            ? "product-page__main__card__details__action__buy__in-cart"
                                            : "product-page__main__card__details__action__buy"
                                    }
                                    onClick={() => this.handleAddProduct()}
                                />
                                <Button
                                    disabled={this.state.product.remainQuantity === 0 || this.state.product.remainQuantity < 0}
                                    size="m"
                                    iconSrc={cartAddIcon}
                                    className="no-text"
                                    onClick={() => this.handleAddProduct()}
                                />
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="product-page__main__details tabs">
                    <div
                        className={`tabs__tab${this.state.menuOpened === "description" ? " opened" : ""}`}
                        onClick={() => this.handleClickTab("description")}
                    >
                        <span>
                            Описание
                        </span>
                    </div>
                    <div
                        className={`tabs__tab${this.state.menuOpened === "reviews" ? " opened" : ""}`}
                        onClick={() => this.handleClickTab("reviews")}
                    >
                        <span>
                            Отзывы
                        </span>
                    </div>
                </div>
                {this.state.menuOpened === "description" && <div className="product-page__main__description">
                    <h2>Описание продукта</h2>
                    <div className="product-page__main__description__value">
                        {this.state.product?.description}
                    </div>
                </div>}
                {this.state.menuOpened === "reviews" && <div className="product-page__main__reviews">
                    <div className="product-page__main__reviews__title">
                        <h2>Отзывы</h2>
                        <Button
                            className="product-page__main__reviews__title__action"
                            title="Оставить отзыв"
                            variant="text"
                        />
                    </div>
                    <div className="product-page__main__reviews__content">
                        {this.state.comments.length === 0
                            ? "У данного товара пока нет отзывов"
                            : this.state.comments.map((comment: any) =>
                                <div className="product-page__main__reviews__content__comment">
                                    <h4 className="product-page__main__reviews__content__comment__info">
                                        <span className="product-page__main__reviews__content__comment__info__review">
                                            <img className={`product-card__reviews__star-block__star-text`} src={StarIcon} />
                                            {comment.review}
                                        </span>
                                        <span className="product-page__main__reviews__content__comment__info__author">
                                            {comment.author}
                                        </span>
                                        <span className="product-page__main__reviews__content__comment__info__date">
                                            <span>
                                                {comment.date.toLocaleTimeString("ru-RU")}
                                            </span>
                                            <span>
                                                {comment.date.toLocaleDateString("ru-RU")}
                                            </span>
                                        </span>
                                    </h4>
                                    <div className="product-page__main__reviews__content__comment__description">
                                        {comment.description}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>}
            </main>
            <Footer />
        </div>
    }
}

export default ProductPage