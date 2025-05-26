import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./styles.scss";
import { getProduct } from "../../api/product";
import { AJAXErrors } from "../../api/errors";
import Button from "../../components/Button/Button";

import ProfileIcon from "../../shared/images/header-profile-ico.svg";
import cartAddIcon from "../../shared/images/cart-add-ico.svg";
import cartSubIcon from "../../shared/images/cart-sub-ico.svg";
import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";

import {
    addToBasket,
    getBasket,
    removeFromBasket,
    updateProductQuantity,
} from "../../api/basket";
import { getComments, sendComment } from "../../api/comments";
import CreateReviewModal from "../../components/CreateReviewModal/CreateReviewModal";
import Alert from "../../components/Alert/Alert";
import InfinityList from "../../components/InfinityList/InfinityList";
import { convertMoney } from "../AdminPage/AdminPage";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getRecommendations } from "../../api/recommendation";

class ProductPage extends Tarakan.Component {
    state: any = {
        product: null,
        commentsOffset: 0,
        comments: [],
        addReviewModal: false,

        showNotAuthAlert: false,
        showNotAuthAlertCart: false,

        showComments: false,
        fetching: false,
        recommendations: [],
    };

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
                },
            });
            this.fetchReviews();
        } else {
            this.app.navigateTo("/");
            return;
        }

        const { code, products } = await getRecommendations(productId);
        if (code === AJAXErrors.NoError) {
            this.setState({
                recommendations: products,
            });
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
            code = (
                await updateProductQuantity(
                    this.state.product.id,
                    this.state.product.quantity + 1,
                )
            ).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.state.product,
                    quantity: this.state.product.quantity + 1,
                },
            });
        }
    }

    async handleRemoveProduct() {
        let code = 0;

        if (this.state.product.quantity === 1) {
            code = await removeFromBasket(this.state.product.id);
        } else {
            code = (
                await updateProductQuantity(
                    this.state.product.id,
                    this.state.product.quantity - 1,
                )
            ).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.state.product,
                    quantity: this.state.product.quantity - 1,
                },
            });
        }
    }

    async fetchReviews() {
        if (!this.state.product) {
            return;
        }
        if (this.state.fetching) {
            return;
        }
        this.state.fetching = true;
        const { code, reviews } = await getComments(
            this.state.product.id,
            this.state.commentsOffset,
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                commentsOffset: this.state.commentsOffset + 7,
                comments: [...this.state.comments, ...reviews],
                fetching: false,
            });
        } else {
            this.state.fetching = false;
        }
    }

    async sendReview(description: string, rating: number) {
        const code = await sendComment(
            this.state.product.id ?? "",
            rating,
            description,
        );
        if (code === AJAXErrors.NoError) {
            // // console.log(this.app.store);
            this.setState({
                comments: [
                    {
                        id: "0",
                        name: this.app.store.user.value.name,
                        surname: this.app.store.user.value.surname,
                        imageURL: this.app.store.user.value.imageURL,
                        rating: rating,
                        comment: description,
                    },
                    ...this.state.comments,
                ],
                product: {
                    ...this.state.product,
                    reviewsCount: this.state.product.reviewsCount + 1,
                    rating:
                        (this.state.product.rating *
                            this.state.product.reviewsCount +
                            rating) /
                        (this.state.product.reviewsCount + 1),
                },
                addReviewModal: false,
            });
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
        return (
            <div className="product-page">
                <Header />
                <main className="product-page__main">
                    <div className="product-page__main__card">
                        <div className="product-page__main__card__image">
                            <img src={`${this.state.product?.image}`} />
                        </div>
                        <div className="product-page__main__card__details">
                            <h1 className="product-page__main__card__details__title">
                                {this.state.product?.name}
                            </h1>
                            <div className="product-page__main__card__details__buyer">
                                {this.state.product?.seller.title}
                            </div>
                            {this.state.product && (
                                <div className="product-page__main__card__details__action">
                                    <span
                                        className={`product-page__main__card__details__action__price${this.state.product.discountPrice !== 0 ? "-discount" : "-default"}`}
                                    >
                                        {convertMoney(
                                            this.state.product.discountPrice ||
                                                this.state.product.price,
                                        )}
                                    </span>
                                    {this.state.product.discountPrice !== 0 && (
                                        <span className="product-page__main__card__details__action__discount">
                                            (-
                                            {parseInt(
                                                `${((this.state.product.price - this.state.product.discountPrice) / this.state.product.price) * 100}`,
                                            )}
                                            %)
                                        </span>
                                    )}
                                    <div className="product-page__main__card__details__action__buy">
                                        <Button
                                            disabled={
                                                this.state.product.quantity ===
                                                0
                                            }
                                            size="m"
                                            iconSrc={cartSubIcon}
                                            className="no-text"
                                            onClick={() => {
                                                if (
                                                    !app.store.user.value.login
                                                ) {
                                                    this.setState({
                                                        showNotAuthAlertCart:
                                                            true,
                                                    });
                                                } else {
                                                    this.handleRemoveProduct();
                                                }
                                            }}
                                        />
                                        <Button
                                            disabled={
                                                this.state.product
                                                    .remainQuantity ?? 0 < 0
                                            }
                                            size="m"
                                            title={
                                                this.state.product.quantity ===
                                                0
                                                    ? "Добавить в корзину"
                                                    : `Добавлено ${this.state.product.quantity} шт`
                                            }
                                            className={
                                                this.state.product.quantity !==
                                                0
                                                    ? "product-page__main__card__details__action__buy__in-cart"
                                                    : "product-page__main__card__details__action__buy"
                                            }
                                            onClick={() => {
                                                if (
                                                    !app.store.user.value.login
                                                ) {
                                                    this.setState({
                                                        showNotAuthAlertCart:
                                                            true,
                                                    });
                                                } else {
                                                    this.handleAddProduct();
                                                }
                                            }}
                                        />
                                        <Button
                                            disabled={
                                                this.state.product
                                                    .remainQuantity === 0 ||
                                                this.state.product
                                                    .remainQuantity < 0
                                            }
                                            size="m"
                                            iconSrc={cartAddIcon}
                                            className="no-text"
                                            onClick={() => {
                                                if (
                                                    !app.store.user.value.login
                                                ) {
                                                    this.setState({
                                                        showNotAuthAlertCart:
                                                            true,
                                                    });
                                                } else {
                                                    this.handleAddProduct();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
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
                            <h2>
                                Отзывы (
                                <img
                                    className="product-page__main__reviews__title__star"
                                    src={StarFilledIcon}
                                />
                                {parseFloat(this.state.product?.rating).toFixed(
                                    2,
                                )}
                                )
                            </h2>
                            {this.state.showNotAuthAlert && (
                                <Alert
                                    title="Необходимо войти"
                                    content="Чтобы оставить отзыв, надо сначала войти в профиль."
                                    successButtonTitle="Войти"
                                    onSuccess={() => app.navigateTo("/signin")}
                                    onClose={() =>
                                        this.setState({
                                            showNotAuthAlert: false,
                                        })
                                    }
                                />
                            )}
                            {this.state.showNotAuthAlertCart && (
                                <Alert
                                    title="Необходимо войти"
                                    content="Чтобы изменить продукты в корзине, надо сначала войти в профиль."
                                    successButtonTitle="Войти"
                                    onSuccess={() => app.navigateTo("/signin")}
                                    onClose={() =>
                                        this.setState({
                                            showNotAuthAlertCart: false,
                                        })
                                    }
                                />
                            )}
                            {this.state.addReviewModal && (
                                <CreateReviewModal
                                    onSend={(D: any, R: any) =>
                                        this.sendReview(D, R)
                                    }
                                    onClose={() =>
                                        this.setState({ addReviewModal: false })
                                    }
                                />
                            )}
                            {this.state.comments.length !== 0 && (
                                <Button
                                    className="product-page__main__reviews__title__action"
                                    title="Оставить отзыв"
                                    variant="text"
                                    onClick={() => {
                                        if (app.store.user.value.login) {
                                            this.setState({
                                                addReviewModal: true,
                                            });
                                        } else {
                                            this.setState({
                                                showNotAuthAlert: true,
                                            });
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <div className="product-page__main__reviews__content">
                            {this.state.comments.length === 0 ? (
                                <div style="display: flex; column-gap: 8px; align-items: center">
                                    <span>
                                        Будьте первым, кто оставит отзыв на этот
                                        товар!
                                    </span>
                                    <Button
                                        variant="text"
                                        title="Оставить отзыв"
                                        size="s"
                                        className="product-page__main__reviews__content__add-product"
                                        onClick={() => {
                                            if (app.store.user.value.login) {
                                                this.setState({
                                                    addReviewModal: true,
                                                });
                                            } else {
                                                this.setState({
                                                    showNotAuthAlert: true,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                (this.state.showComments
                                    ? this.state.comments
                                    : this.state.comments.slice(0, 3)
                                ).map((comment: any) => (
                                    <div className="product-page__main__reviews__content__comment">
                                        <div className="product-page__main__reviews__content__comment__info">
                                            <span className="product-page__main__reviews__content__comment__info__avatar">
                                                <img
                                                    className="product-page__main__reviews__content__comment__info__avatar__img"
                                                    src={
                                                        comment.imageURL ??
                                                        ProfileIcon
                                                    }
                                                />
                                            </span>
                                            <span className="product-page__main__reviews__content__comment__info__author">
                                                {comment.name}
                                            </span>
                                            <span className="product-page__main__reviews__content__comment__info__review">
                                                <span className="product-page__main__reviews__content__comment__info__review__rating">
                                                    {Array(5)
                                                        .fill(0)
                                                        .map((E, I) => (
                                                            <img
                                                                className="product-page__main__reviews__content__comment__info__review__rating__star"
                                                                src={
                                                                    comment.rating >
                                                                    I
                                                                        ? StarFilledIcon
                                                                        : StarIcon
                                                                }
                                                            />
                                                        ))}
                                                </span>
                                                <span className="product-page__main__reviews__content__comment__info__review__value">
                                                    {comment.rating}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="product-page__main__reviews__content__comment__description">
                                            {comment.comment}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {this.state.showComments ? (
                            <InfinityList onShow={() => this.fetchReviews()} />
                        ) : (
                            this.state.comments.length > 3 && (
                                <Button
                                    variant="text"
                                    title="Показать все комментарии"
                                    className="product-page__main__reviews__content__more"
                                    onClick={() =>
                                        this.setState({ showComments: true })
                                    }
                                />
                            )
                        )}
                    </div>
                    {this.state.recommendations.length > 0 && (
                        <h2>Возможно, Вам понравится</h2>
                    )}
                    <div className={`product-page__main__recommendations`}>
                        {this.state.recommendations.map((item: any) => (
                            <ProductCard
                                id={`${item.id}`}
                                inCart={item.isInCart}
                                price={`${item.price}`}
                                discountPrice={item.discountPrice}
                                title={`${item.name}`}
                                rating={`${item.rating}`}
                                reviewsCount={`${item.reviewsCount}`}
                                mainImageAlt={`Изображение товара ${item.name}`}
                                mainImageSrc={item.image}
                                onError={(err) => {
                                    if (err === AJAXErrors.Unauthorized) {
                                        this.setState({
                                            showNotAuthAlert: true,
                                        });
                                    }
                                }}
                            />
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

export default ProductPage;
