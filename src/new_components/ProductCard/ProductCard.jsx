import Tarakan from "../../../modules/tarakan.js";
import Button, {BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION} from "../Button/Button.jsx";

import CardButtonIcon from "../../shared/images/productCard-cart-ico.svg";

import "./styles.scss";
import {SERVER_URL} from "../../settings.js";
import ajax from "../../../modules/ajax.js";

class ProductCard extends Tarakan.Component {

    async handleAddToCart(itemId) {
        console.log(`Trying to add: ${itemId}`);
        const response = await ajax.post("api/basket/add", {
            product_id: itemId,
        }, {
            origin: SERVER_URL,
        });

        if (!response.error && response.result.ok) {
            console.log(`[debug] Item added to cart: ${itemId}`);
            console.log(`[debug] Item added to cart (json): ${await response.result.json()}`);
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
                <div className={`sell-price`}>{props.price} ₽</div>
                {props.oldPrice && <div className={`old-price`}>{props.oldPrice} ₽</div>}
                {props.sale && <div className={`sale-percentage`}>-{props.sale}%</div>}
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
                    className={`full-wide`}
                    iconAlt={`Иконка корзины`}
                    iconSrc={`${CardButtonIcon}`}
                    title='В корзину'
                    onClick={() => this.handleAddToCart(props.id)}
                />
            </div>
        </article>
    }
}

export default ProductCard;
