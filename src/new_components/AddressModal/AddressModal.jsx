import Tarakan from "../../../modules/tarakan.js";
import Form from "../Form/Form.jsx";
import TextField from "../TextField/TextField.jsx";
import "./styles.scss";

import crossIcon from "../../shared/images/cross-ico.svg";
import loadingIcon from "../../shared/images/loading-ico.svg";

import Button from "../Button/Button.jsx";
import { VALID_TYPES } from "../../../modules/validation.js";
import ajax from "../../../modules/ajax.js";
import { GEOPIFY_KEY } from "../../settings.js";

class AddressModal extends Tarakan.Component {
    state = {
        opened: false,
        checking: false,
        form: {
            name: "Адрес 1",
            city: "Москва",
            street: "Веерная",
            house: "3",
            housing: "1",
            flat: "95"
        }
    }

    async handleCheckAddress(address) {
        const res = await ajax.get(
            "v1/geocode/search?" + Object.entries({
                apiKey: GEOPIFY_KEY,
                type: "amenity",
                country: "Russia",
                street: address.street,
                housenumber: `дом ${address.house}, корпус ${address.housing}`,
            }).map(([K, E]) => `${K}=${encodeURIComponent(E)}`).join("&"),
            { origin: "https://api.geoapify.com" },
        );

        if (!res.error) {
            const responseData = await res.result.json();
            return responseData.features.length !== 0;
        }

        return false;
    }

    handleUpdateForm(name, value) {
        this.setState({
            form: {
                ...this.state.form,
                [name]: value,
            }
        });
    }

    async handleSave() {
        for (let key of Object.keys(this.state.form)) {
            if (!this.state.form[key]) {
                return;
            }
        }

        this.setState({ checking: true });

        await this.handleCheckAddress(this.state.form);

        this.props.onEnd({
            ...this.state.form,
            id: parseInt(Math.random() * 100000),
        });
    }

    update(newPropes) {
        this.setState({ opened: newPropes.opened });
    }

    render(props) {
        return <div className={`modal${!props.opened ? " close" : ""}`}>
            <div className="modal-shadow"></div>
            <div className="modal-content">
                <div className="title">
                    <h2>Добавление нового адреса</h2>
                    <img className="close-button" src={crossIcon} onClick={() => props.onClose && props.onClose()} />
                </div>
                <hr />
                <p className="description">
                    <TextField
                        className="name"
                        title="Название адреса"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="Адрес 1"
                        onEnd={(ok, value) => this.handleUpdateForm("name", value)}
                    />
                    <TextField
                        className="city"
                        title="Город"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="Москва"
                        onEnd={(ok, value) => this.handleUpdateForm("city", value)}
                    />
                    <TextField
                        className="street"
                        title="Улица"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="Веерная"
                        onEnd={(ok, value) => this.handleUpdateForm("street", value)}
                    />
                    <TextField
                        className="house"
                        title="Дом"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="3"
                        onEnd={(ok, value) => this.handleUpdateForm("house", value)}
                    />
                    <TextField
                        className="housing"
                        title="Корпус"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="1"
                        onEnd={(ok, value) => this.handleUpdateForm("housing", value)}
                    />
                    <TextField
                        className="flat"
                        title="Квартира"
                        validType={VALID_TYPES.NOT_NULL_VALID}
                        value="95"
                        onEnd={(ok, value) => this.handleUpdateForm("flat", value)}
                    />
                </p>
                <div className="actions">
                    <Button className="save" title="Сохранить" onClick={() => this.handleSave()} />
                    {this.state.checking && <div className="loading">
                        <span>Проверка адреса</span>
                        <img src={loadingIcon} />
                    </div>}
                </div>
            </div>
        </div>
    }
}

export default AddressModal;