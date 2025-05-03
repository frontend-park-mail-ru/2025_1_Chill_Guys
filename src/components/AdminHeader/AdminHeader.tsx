import Tarakan from "bazaar-tarakan";

import Button, { BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION } from "../Button/Button";
import SVGImage from "../SVGImage/SVGImage";

import LogoFull from "../../shared/images/LogoFull.svg";
import HeaderSaved from "../../shared/images/header-saved-ico.svg";

import "./styles.scss";

class AdminHeader extends Tarakan.Component {
    render(props, app) {
        return <header className="header-admin header_light">
            <div className="header-admin__nav">
                <div className="header-admin__nav__row header-admin__nav__row_main">
                    <div className="header-admin__nav__logo">
                        <img
                            className="header-admin__nav__logo__img"
                            alt='Логотип маркетплейса Bazaar'
                            src={`${LogoFull}`}
                            onClick={() => {
                                app.navigateTo("/");
                            }}
                        />
                        <span className="header-admin__nav__logo__text">ADMIN</span>
                    </div>

                    <div className="header-admin__nav__row_main__icons-wrapper">
                        <Button
                            size={`${BUTTON_SIZE.L}`}
                            iconPosition={`${ICON_POSITION.TOP}`}
                            variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                            title='Заказы'
                            icon={<SVGImage src={HeaderSaved} />}
                            iconAlt='Иконка заказов'
                            onClick={() => {
                                app.navigateTo('/orders');
                            }}
                        />
                    </div>
                </div>

                <div
                    className={`header-admin__nav__secondary${this.state.popUpDisplayed ? " hidden" : ""}`}
                >
                    <div className={`categories-wrapper`}>
                        <span onClick={() => app.navigateTo("/admin/sellers")}>Продавцы</span>
                        <span onClick={() => app.navigateTo("/admin/products")}>Товары</span>
                    </div>
                </div>
            </div>
        </header >
    }
}

export default AdminHeader;