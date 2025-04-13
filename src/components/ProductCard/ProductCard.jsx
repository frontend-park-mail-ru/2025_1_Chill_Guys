import Tarakan from "../../../modules/tarakan.js";
import Button, { BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION } from "../Button/Button.jsx";

import CardButtonIcon from "../../shared/images/productCard-cart-ico.svg";

import "./styles.scss";
import { SERVER_URL } from "../../settings.js";
import ajax from "../../../modules/ajax.js";
import { addToBasket } from "../../api/basket";
import { AJAXErrors } from "../../api/errors";

class ProductCard extends Tarakan.Component {

    state = {
        isInCart: false,
    }

    init(props) {
        this.state.isInCart = props.inCart;
    }

    async handleAddToCart(itemId) {
        const code = await addToBasket(itemId);

        if (code === AJAXErrors.NoError) {
            this.setState({ isInCart: true });
        }
    }

    render(props, router) {
        return <article className={`product-card flex column`}>
            <div className={`carousel-images`}>
                <div className={`active-image-wrapper`}>
                    <img
                        className={`card-image`}
                        alt={`${props.mainImageAlt}`}
                        src={`${props.mainImageSrc}`}
                    />
                </div>

                <div className={`controls`}>
                    ...
                </div>
            </div>

            <div className={`prices full-wide`}>
                <div className={`sell-price`}>{props.discountPrice || props.price} ₽</div>
                {
                    props.discountPrice != 0 && <div className={`old-price`}>{props.price} ₽</div>
                }
                {
                    props.discountPrice != 0 && <div className={`sale-percentage`}>{parseInt((props.discountPrice - props.price) / props.price * 100)}%</div>
                }
            </div>

            {
                props.brand
                &&
                <div className={`brand full-wide`}>
                    {props.brand}
                </div>
            }

            <div className={`product-title full-wide`}>
                {props.title}
            </div>

            <div className={`reviews flex full-wide`}>
                <div className={`star-block flex`}>
                    <span className={`star-text`}>{props.rating}</span>
                </div>
                <div className={`count-block`}>
                    {props.reviewsCount} отзывов
                </div>
            </div>

            <div className={`product-manip full-wide`}>
                <Button
                    size={`${BUTTON_SIZE.L}`}
                    variant={`${BUTTON_VARIANT.PRIMARY}`}
                    iconPosition={`${ICON_POSITION.LEFT}`}
                    className={`full-wide ${this.state.isInCart ? 'in-cart-btn' : ''}`}
                    iconAlt={this.state.isInCart ? '' : `Иконка корзины`}
                    iconSrc={`${this.state.isInCart ? '' : CardButtonIcon}`}
                    title={this.state.isInCart ? 'В корзине' : 'В корзину'}
                    onClick={
                        () =>
                            this.state.isInCart ? router.navigateTo('/cart') : this.handleAddToCart(props.id)
                    }
                />
            </div>
        </article>
    }
}

export default ProductCard;
