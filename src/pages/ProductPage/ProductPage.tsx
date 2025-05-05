import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./styles.scss";
import {getProduct} from "../../api/product";
import {AJAXErrors} from "../../api/errors";
import Button from "../../components/Button/Button";

import ProfileIcon from "../../shared/images/header-profile-ico.svg";
import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";
import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";

import {addToBasket, getBasket, removeFromBasket, updateProductQuantity} from "../../api/basket";
import {getComments, sendComment} from "../../api/comments";
import CreateReviewModal from "../../components/CreateReviewModal/CreateReviewModal";
import Alert from "../../components/Alert/Alert";
import InfinityList from "../../components/InfinityList/InfinityList";

class ProductPage extends Tarakan.Component {
    state: any = {
        product: null,
        commentsOffset: 0,
        comments: [],
        addReviewModal: false,
        showNotAuthAlert: false,
        showComments: false,
    }

    async fetchProduct() {
        const productId = this.app.urlParams.productId;
        const {code: basketCode, data} = await getBasket();
        let quantity = 0;

        if (basketCode === AJAXErrors.NoError) {
            for (const item of data.products) {
                if (item.productId === productId) {
                    quantity = item.quantity;
                    break;
                }
            }
        }

        const {code: productCode, product} = await getProduct(productId);

        if (productCode === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...product,
                    quantity,
                }
            });
            this.fetchReviews();
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

    async fetchReviews() {
        if (!this.state.product) {
            alert(JSON.stringify(this.state));
            return;
        }
        const {code, reviews} = await getComments(this.state.product.id, this.state.commentsOffset);
        if (code === AJAXErrors.NoError) {
            this.setState({
                commentsOffset: this.state.commentsOffset + 7,
                comments: [
                    ...this.state.comments,
                    ...reviews,
                ],
            })
        }
    }

    async sendReview(description: string, rating: number) {
        const code = await sendComment(this.state.product.id ?? "", rating, description);
        if (code === AJAXErrors.NoError) {
            console.log(this.app.store);
            this.setState({
                comments: [
                    {
                        "id": "0",
                        "name": this.app.store.user.value.name,
                        "surname": this.app.store.user.value.surname,
                        "imageURL": this.app.store.user.value.imageURL,
                        "rating": rating,
                        "comment": description,
                    },
                    ...this.state.comments,
                ],
                addReviewModal: false
            })
        }
    }

    update() {
        if (this.app.urlParams.productId) {
            this.fetchProduct();
        } else {
            this.app.navigateTo("/");
        }
    }

    init() {
        if (this.app.urlParams.productId) {
            this.fetchProduct();
        } else {
            this.app.navigateTo("/");
        }
    }

    render(props, app) {
        return <div className="product-page">
            <Header/>
            <main className="product-page__main">
                <div className="product-page__main__card">
                    <div className="product-page__main__card__image">
                        <img src={`${this.state.product?.image}`}/>
                    </div>
                    <div className="product-page__main__card__details">
                        <h1 className="product-page__main__card__details__title">{this.state.product?.name}</h1>
                        <div className="product-page__main__card__details__buyer">
                            ООО "Клуб анонимных фронтендеров и бекэндеров"
                        </div>
                        {this.state.product && <div className="product-page__main__card__details__action">
                            <div>
                            <span
                                className={`product-page__main__card__details__action__price${this.state.product.discountPrice !== 0 ? "-discount" : "-default"}`}>
                                {this.state.product.discountPrice || this.state.product.price} ₽
                            </span>
                                {
                                    this.state.product.discountPrice !== 0 &&
                                    <span className="product-page__main__card__details__action__discount">
                                    (-{parseInt(`${(this.state.product.price - this.state.product.discountPrice) / this.state.product.price * 100}`)}%)
                                </span>
                                }
                            </div>
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
                <div className="product-page__main__description">
                    <h2>Описание</h2>
                    <div className="product-page__main__description__value">
                        {this.state.product?.description}
                    </div>
                </div>
                <div className="product-page__main__reviews">
                    <div className="product-page__main__reviews__title">
                        <h2>Отзывы (<img
                            className="product-page__main__reviews__title__star"
                            src={StarFilledIcon}
                        />{parseFloat(this.state.product?.rating).toFixed(2)})</h2>
                        {this.state.showNotAuthAlert && <Alert
                            title="Необходимо войти"
                            content="Чтобы оставить отзыв, надо сначала войти в профиль."
                            successButtonTitle="Войти"
                            onSuccess={() => app.navigateTo("/signin")}
                            onClose={() => this.setState({showNotAuthAlert: false})}
                        />}
                        {this.state.addReviewModal &&
                            <CreateReviewModal onSend={(D: any, R: any) => this.sendReview(D, R)}
                                               onClose={() => this.setState({addReviewModal: false})}/>}
                        <Button
                            className="product-page__main__reviews__title__action"
                            title="Оставить отзыв"
                            variant="text"
                            onClick={() => {
                                if (app.store.user.value.login) {
                                    this.setState({addReviewModal: true})
                                } else {
                                    this.setState({showNotAuthAlert: true})
                                }
                            }}
                        />
                    </div>
                    <div className="product-page__main__reviews__content">
                        {this.state.comments.length === 0
                            ? "У данного товара пока нет отзывов"
                            : (this.state.showComments ? this.state.comments : this.state.comments.slice(0, 3)).map((comment: any) =>
                                <div className="product-page__main__reviews__content__comment">
                                    <div className="product-page__main__reviews__content__comment__info">
                                        <span className="product-page__main__reviews__content__comment__info__avatar">
                                            <img
                                                className="product-page__main__reviews__content__comment__info__avatar__img"
                                                src={comment.imageURL ?? ProfileIcon}
                                            />
                                        </span>
                                        <span className="product-page__main__reviews__content__comment__info__author">
                                            {comment.name}
                                        </span>
                                        <span className="product-page__main__reviews__content__comment__info__review">
                                            <span
                                                className="product-page__main__reviews__content__comment__info__review__rating"
                                            >
                                                {Array(5).fill(0).map((E, I) =>
                                                    <img
                                                        className="product-page__main__reviews__content__comment__info__review__rating__star"
                                                        src={comment.rating > I ? StarFilledIcon : StarIcon}
                                                    />
                                                )}
                                            </span>
                                            <span
                                                className="product-page__main__reviews__content__comment__info__review__value">
                                                {comment.rating}
                                            </span>
                                        </span>
                                        {/* <span className="product-page__main__reviews__content__comment__info__date">
                                            <span>
                                                {comment.date.toLocaleTimeString("ru-RU")}
                                            </span>
                                            <span>
                                                {comment.date.toLocaleDateString("ru-RU")}
                                            </span>
                                        </span> */}
                                    </div>
                                    <div className="product-page__main__reviews__content__comment__description">
                                        {comment.comment}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {
                        this.state.showComments
                            ? <InfinityList onShow={() => this.fetchReviews()}/>
                            : <Button
                                variant="text"
                                title="Показать все комментарии"
                                className="product-page__main__reviews__content__more"
                                onClick={() => this.setState({showComments: true})}
                            />
                    }
                </div>
            </main>
            <Footer/>
        </div>
    }
}

export default ProductPage;