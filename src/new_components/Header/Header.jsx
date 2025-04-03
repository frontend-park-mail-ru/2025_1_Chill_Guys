import Tarakan from "../../../modules/tarakan.js";

import Button from "../Button/Button.jsx";
import TextField from "../TextField/TextField.jsx";
import {BUTTON_SIZE} from "../Button/Button.jsx";
import {TEXTFIELD_TYPES} from "../TextField/TextField.jsx";

import "./styles.scss";

import LogoFull from "../../shared/images/LogoFull.svg";
import CatalogButtonIcon from "../../shared/images/catalog-button-ico.svg";

class Header extends Tarakan.Component {
    render(props) {
        return <header className={`flex-column header__light`}>

            <div className={`header-row main-row`}>
                <img
                    className={`logo`}
                    alt={`Логотип маркетплейса Bazaar`}
                    src={`${LogoFull}`}
                />

                <div className={`search-field-wrapper flex`}>
                    <Button
                        size={BUTTON_SIZE.L}
                        title={`Каталог`}
                        iconSrc={`${CatalogButtonIcon}`}
                        iconAlt={`Иконка каталога`}
                        onClick={() => {console.log('hello, world!');}}
                    />

                    <div className={`tf`}>
                        <TextField
                            type={`${TEXTFIELD_TYPES.SEARCH}`}
                            title={`Ищите что угодно на Bazaar`}
                            otherClasses={`tf__type__input__width__400`}
                        />
                    </div>
                </div>

                <div className={`icons-wrapper flex`}></div>

            </div>

            <div className={`header-row secondary-row`}>
                <div className={`address-wrapper`}>
                    Улица Космонавтов 7
                </div>
            </div>

        </header>
    }
}

export default Header;
