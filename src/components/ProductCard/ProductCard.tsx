import Tarakan from "bazaar-tarakan";
import Button, {
    BUTTON_SIZE,
    BUTTON_VARIANT,
    ICON_POSITION,
} from "../Button/Button";

import CardButtonIcon from "../../shared/images/productCard-cart-ico.svg";
import StarIcon from "../../shared/images/productCard-star-ico.svg";

import "./styles.scss";
import {
    addToBasket,
    removeFromBasket,
    updateProductQuantity,
} from "../../api/basket";
import { AJAXErrors } from "../../api/errors";

class ProductCard extends Tarakan.Component {
    state = {
        isInCart: false,
    };

    init(props: any) {
        this.state.isInCart = props.inCart;
    }

    async handleAddToCart(itemId: any) {
        const code = await addToBasket(itemId);

        if (code === AJAXErrors.NoError) {
            this.setState({ isInCart: true });
        }

        if (code === AJAXErrors.Unauthorized) {
            if (this.props.onError) this.props.onError(AJAXErrors.Unauthorized);
        }
    }

    async handleAddProduct() {
        let code = 0;

        if (this.props.quantity === 0) {
            code = await addToBasket(this.props.id);
        } else {
            code = (
                await updateProductQuantity(
                    this.props.id,
                    this.props.quantity + 1,
                )
            ).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.props,
                    quantity: this.props.quantity + 1,
                },
            });
        }

        if (code === AJAXErrors.Unauthorized) {
            if (this.props.onError) this.props.onError(AJAXErrors.Unauthorized);
        }
    }

    async handleRemoveProduct() {
        let code = 0;

        if (this.props.quantity === 1) {
            code = await removeFromBasket(this.props.id);
        } else {
            code = (
                await updateProductQuantity(
                    this.props.id,
                    this.props.quantity - 1,
                )
            ).code;
        }

        if (code === AJAXErrors.NoError) {
            this.setState({
                product: {
                    ...this.props,
                    quantity: this.props.quantity - 1,
                },
            });
        }
    }

    render(props: any, router: any) {
        return (
            <article className={`product-card flex column`}>
                <div
                    className="product-card__body"
                    onClick={() => router.navigateTo(`/product/${props.id}`)}
                >
                    <div className={`product-card__carousel-images`}>
                        <div
                            className={`product-card__carousel-images__active-image-wrapper`}
                        >
                            <img
                                className={`product-card__carousel-images__active-image-wrapper__card-image`}
                                alt={`${props.mainImageAlt}`}
                                src={`${props.mainImageSrc}`}
                            />
                        </div>

                        <div
                            className={`product-card__carousel-images__controls`}
                        ></div>
                    </div>

                    <div className={`product-card__prices full-wide`}>
                        <div
                            className={`product-card__prices__sell-price${props.discountPrice != 0 ? " discount" : ""}`}
                        >
                            {props.discountPrice || props.price} ₽
                        </div>
                        {props.discountPrice != 0 && (
                            <div className={`product-card__prices__old-price`}>
                                {props.price} ₽
                            </div>
                        )}
                        {props.discountPrice != 0 && (
                            <div
                                className={`product-card__prices__sale-percentage`}
                            >
                                {`${-parseInt(`${((props.price - props.discountPrice) / props.price) * 100}`)}`}
                                %
                            </div>
                        )}
                    </div>

                    {props.brand && (
                        <div className={`product-card__brand full-wide`}>
                            {props.brand}
                        </div>
                    )}

                    <div className={`product-card__product-title full-wide`}>
                        {props.title}
                    </div>

                    <div className={`product-card__reviews flex full-wide`}>
                        <div
                            className={`product-card__reviews__star-block flex`}
                        >
                            <img
                                className={`product-card__reviews__star-block__star-text`}
                                src={StarIcon}
                            />
                            <span>{parseFloat(props.rating).toFixed(2)}</span>
                        </div>
                        <div
                            className={`product-card__reviews__star-block__count-block`}
                        >
                            {props.reviewsCount} отзывов
                        </div>
                    </div>
                </div>

                <div
                    className={`product-card__reviews__star-block__product-manip full-wide`}
                >
                    <Button
                        size={`${BUTTON_SIZE.L}`}
                        variant={`${BUTTON_VARIANT.PRIMARY}`}
                        iconPosition={`${ICON_POSITION.LEFT}`}
                        className={`full-wide ${this.state.isInCart ? "product-card__product-manip__in-cart-btn" : ""}`}
                        iconAlt={this.state.isInCart ? "" : `Иконка корзины`}
                        iconSrc={`${this.state.isInCart ? "" : CardButtonIcon}`}
                        title={this.state.isInCart ? "В корзине" : "В корзину"}
                        onClick={() => {
                            if (this.state.isInCart) {
                                router.navigateTo("/cart");
                            } else {
                                this.handleAddToCart(props.id);
                            }
                        }}
                    />
                </div>
            </article>
        );
    }
}

export default ProductCard;
