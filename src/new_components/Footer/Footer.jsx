import Tarakan from "../../../modules/tarakan.js";

import "./styles.scss";

import LogoFull from "../../shared/images/LogoFull.svg";

class Footer extends Tarakan.Component {
    state = {}

    render(props, router) {
        return <footer className={`footer light`}>

            <div className={`flex column ico-column`}>
                <img
                    alt={`Базар логотип`}
                    className={`logo`}
                    src={`${LogoFull}`}
                    onClick={() => {
                        router.navigateTo("/");
                    }}
                />
            </div>

            <div className={`links-wrapper`}>

                <div className={`links-columns`}>
                    <div>
                        <h4 className={`h-reset footer-h4`}>Bazaar маркетплейс</h4>
                        <ol className={`list-reset footer-list`}>
                            <li>О Bazaar / About Bazaar</li>
                            <li>Вакансии</li>
                            <li>Реквизиты</li>
                            <li>Стать курьером</li>
                        </ol>
                    </div>

                    <div>
                        <h4 className={`h-reset footer-h4`}>Зарабатывать с Bazaar</h4>
                        <ol className={`list-reset footer-list`}>
                            <li>Стать продавцом</li>
                            <li>Что продавать на Bazaar</li>
                            <li>Открыть ПВЗ Bazaar</li>
                        </ol>
                    </div>

                    <div>
                        <h4 className={`h-reset footer-h4`}>Помощь</h4>
                        <ol className={`list-reset footer-list`}>
                            <li>Как сделать заказ</li>
                            <li>Оплата</li>
                            <li>Доставка</li>
                            <li>Адреса ПВЗ</li>
                            <li>Возврат товаров</li>
                            <li>Контакты</li>
                            <li>Безопасность</li>
                            <li>Условия обработки данных</li>
                        </ol>
                    </div>
                </div>

                <div className={`all-right-reserved`}>
                    <p>© 2025 «Базар»</p>
                    <p>Все права защищены.</p>
                </div>

            </div>

        </footer>
    }
}

export default Footer;
