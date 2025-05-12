import Tarakan from "bazaar-tarakan";

import "./styles.scss";

import LogoFull from "../../shared/images/LogoFull.svg";

class Footer extends Tarakan.Component {
    state = {};

    render(props: any, router: any) {
        return (
            <footer className={`footer footer_light`}>
                <div className={`footer__ico-column flex column`}>
                    <img
                        alt={`Базар логотип`}
                        className={`footer__ico-column__logo`}
                        src={`${LogoFull}`}
                        onClick={() => {
                            router.navigateTo("/");
                        }}
                    />
                </div>

                <div className={`footer__links-wrapper`}>
                    <div className={`footer__links-wrapper__links-columns`}>
                        <div>
                            <h4 className={`footer_h4`}>Bazaar маркетплейс</h4>
                            <ol
                                className={`list-reset footer__links-wrapper__links-columns__footer-list`}
                            >
                                <li>О Bazaar / About Bazaar</li>

                                <li
                                    onClick={() => {
                                        router.navigateTo("/");
                                    }}
                                >
                                    Главная
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div
                        className={`footer__links-wrapper__all-right-reserved`}
                    >
                        <p>© 2025 «Базар»</p>
                        <p>Все права защищены.</p>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
