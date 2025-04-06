import Tarakan from "../../../modules/tarakan.js";
import Button, {BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION} from "../Button/Button.jsx";

import CardButtonIcon from "../../shared/images/productCard-cart-ico.svg";

import "./styles.scss";

class ProductCard extends Tarakan.Component {
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
                />
            </div>
        </article>
    }
}

export default ProductCard;
