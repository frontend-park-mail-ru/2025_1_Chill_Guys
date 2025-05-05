import Tarakan from "bazaar-tarakan";

import Button, { BUTTON_SIZE, BUTTON_VARIANT, ICON_POSITION } from "../Button/Button";
import SVGImage from "../SVGImage/SVGImage";

import LogoFull from "../../shared/images/LogoFull.svg";

import LogoutIcon from "../../shared/images/logout-ico.svg";
import LogoutIconHover from "../../shared/images/logout-ico-hover.svg";

import "./styles.scss";

class SellerHeader extends Tarakan.Component {
    state = {
        logoutIcon: LogoutIcon,
    }

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
                        <span className="header-admin__nav__logo__text">ПРОДАВЕЦ</span>
                    </div>

                    <div className="header-admin__nav__row_main__icons-wrapper">
                        <Button
                            className="header-admin__nav__row_main__icons-wrapper__item"
                            size={`${BUTTON_SIZE.L}`}
                            variant={`${BUTTON_VARIANT.TRANSPARENT}`}
                            iconPosition={`${ICON_POSITION.TOP}`}
                            title='Выйти'
                            iconSrc={this.state.logoutIcon}
                            onMouseOver={() => this.setState({ logoutIcon: LogoutIconHover })}
                            onMouseLeave={() => this.setState({ logoutIcon: LogoutIcon })}
                            onClick={() => {
                                app.navigateTo('/');
                            }}
                        />
                    </div>
                </div>
            </div>
        </header >
    }
}

export default SellerHeader;