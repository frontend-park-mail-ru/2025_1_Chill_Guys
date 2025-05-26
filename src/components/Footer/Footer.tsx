import Tarakan from "bazaar-tarakan";

import "./styles.scss";

class Footer extends Tarakan.Component {
    state = {};

    render() {
        return (
            <footer className={`footer footer_light`}>
                © 2025 «Bazaar». Все права защищены.
            </footer>
        );
    }
}

export default Footer;
