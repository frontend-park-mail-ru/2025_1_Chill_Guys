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
import { saveAddress } from "../../api/address";
import { AJAXErrors } from "../../api/errors";

class AddressModal extends Tarakan.Component {
    state = {
        opened: false,
        searching: false,
        searchResult: null,
        selectedResult: -1,
        form: {
            name: "Адрес 1",
            city: "Батагай",
            street: "Октябрьская",
            house: "32",
            flat: "95"
        }
    }

    async handleCheckAddress(address) {
        const res = await ajax.get(
            "v1/geocode/search?" + Object.entries({
                lang: "ru",
                apiKey: GEOPIFY_KEY,
                country: "Russia",
                city: address.city,
                street: address.street,
                housenumber: address.house,
            }).map(([K, E]) => `${K}=${encodeURIComponent(E)}`).join("&"),
            { origin: "https://api.geoapify.com", noCredentials: true },
        );

        if (!res.error) {
            const responseData = await res.result.json();
            this.setState({
                searching: false,
                selectedResult: -1,
                searchResult: responseData.features.filter((E) =>
                    E.properties.result_type == "building" && E.properties.rank.importance != undefined
                ).map((E) => ({
                    lat: E.properties.lat,
                    log: E.properties.log,
                    addressName: E.properties.address_line1,
                    addressSurname: E.properties.address_line2,
                    address: E.properties.formatted,
                    importance: E.properties.rank.importance,
                    rawData: E.properties,
                })),
            })
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

    async handleSearch() {
        this.setState({ searching: true });
        await this.handleCheckAddress(this.state.form);
    }

    async handleSave() {
        const address = this.state.searchResult[this.state.selectedResult];
        const code = await saveAddress(
            address.rawData.state,
            address.rawData.city,
            address.address,
            `${address.lat},${address.log}`,
            this.state.form.name
        );

        if (code === AJAXErrors.NoError) {
            this.props.onEnd(true);
        } else {
            this.props.onEnd(false);
        }
    }

    update(newPropes) {
        this.setState({ opened: newPropes.opened });
    }

    render(props) {
        return <div className={`address-modal${!props.opened ? " close" : ""}`}>
            <div className="modal-shadow"></div>
            {
                !this.state.searchResult
                    ? <div className="modal-content">
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
                                value={this.state.form.name}
                                status={this.state.searching ? "success" : "default"}
                                onEnd={(ok, value) => this.handleUpdateForm("name", value)}
                            />
                            <TextField
                                className="city"
                                title="Город"
                                validType={VALID_TYPES.NOT_NULL_VALID}
                                value={this.state.form.city}
                                status={this.state.searching ? "success" : "default"}
                                onEnd={(ok, value) => this.handleUpdateForm("city", value)}
                            />
                            <TextField
                                className="street"
                                title="Улица"
                                validType={VALID_TYPES.NOT_NULL_VALID}
                                value={this.state.form.street}
                                status={this.state.searching ? "success" : "default"}
                                onEnd={(ok, value) => this.handleUpdateForm("street", value)}
                            />
                            <TextField
                                className="house"
                                title="Дом"
                                validType={VALID_TYPES.NOT_NULL_VALID}
                                value={this.state.form.house}
                                status={this.state.searching ? "success" : "default"}
                                onEnd={(ok, value) => this.handleUpdateForm("house", value)}
                            />
                            <TextField
                                className="flat"
                                title="Квартира"
                                validType={VALID_TYPES.NOT_NULL_VALID}
                                value={this.state.form.flat}
                                status={this.state.searching ? "success" : "default"}
                                onEnd={(ok, value) => this.handleUpdateForm("flat", value)}
                            />
                        </p>
                        <div className="actions">
                            <Button className="save" title="Искать" onClick={() => this.handleSearch()} />
                            {this.state.searching && <div className="loading">
                                <span>Поиск совпадений</span>
                                <img src={loadingIcon} />
                            </div>}
                        </div>
                    </div>
                    : <div className="modal-content">
                        <div className="title">
                            <h2>Добавление нового адреса</h2>
                            <img className="close-button" src={crossIcon} onClick={() => props.onClose && props.onClose()} />
                        </div>
                        <hr />
                        <p className="search-result">
                            {
                                this.state.searchResult.length === 0
                                    ? <p>
                                        Данный адрес не найден. Проверьте правильности введённого адреса
                                    </p>
                                    : this.state.searchResult.map((result, I) =>
                                        <article
                                            className={`card${I == this.state.selectedResult ? " selected" : ""}`}
                                            onClick={() => this.setState({ selectedResult: I })}
                                        >
                                            <p className="name">
                                                {result.addressName}
                                            </p>
                                            <p className="surname">
                                                {result.addressSurname}
                                            </p>
                                        </article>
                                    )
                            }
                        </p>
                        <div className="actions">
                            <Button className="edit" variant="text" title="Ввести другой адрес" onClick={() => this.setState({ searchResult: null })} />
                            {this.state.selectedResult !== -1 && <Button className="edit" title="Сохранить" onClick={() => this.handleSave()} />}
                        </div>
                    </div>
            }
        </div >
    }
}

export default AddressModal;