import Tarakan from "bazaar-tarakan";
import { ValidTypes } from "bazaar-validation";

import TextField from "../TextField/TextField";
import Button from "../Button/Button";

import crossIcon from "../../shared/images/cross-ico.svg";
import "./styles.scss";

class PromocodeModal extends Tarakan.Component {
    state = {
        opened: false,
        searching: false,
        searchResult: null,
        selectedResult: -1,
        form: {
            name: "",
            percent: "",
            startDate: "",
            endDate: ""
        },
    }

    handleUpdateForm(name, value) {
        this.setState({
            form: {
                ...this.state.form,
                [name]: value,
            },
        });
    }

    update(newPropes) {
        this.setState({ opened: newPropes.opened });
    }

    render(props) {
        return (
            <div className={`promocode-modal${!props.opened ? " close" : ""}`}>
                <div className="promocode-modal__modal-shadow"></div>
                <div className="promocode-modal__modal-content">
                    <div className="promocode-modal__modal-content__title">
                        <h2>Добавление нового промокода</h2>
                        <img
                            className="promocode-modal__modal-content__title__close-button"
                            src={crossIcon}
                            onClick={() => props.onClose && props.onClose()}
                        />
                    </div>
                    <hr />
                    <p className="promocode-modal__modal-content__description">
                        <TextField
                            className="address-modal__modal-content__description__name"
                            title="Промокод"
                            validType={ValidTypes.NotNullValid}
                            value={this.state.form.name}
                            onEnd={(ok, value) =>
                                this.handleUpdateForm("name", value)
                            }
                        />
                        <TextField
                            type="number"
                            className="address-modal__modal-content__description__name"
                            title="Скидка"
                            value={this.state.form.name}
                            onEnd={(ok, value) =>
                                this.handleUpdateForm("percent", value)
                            }
                        />
                        <div style="font-weight: bold">
                            Срок действия:
                        </div>
                        <TextField
                            type="datetime-local"
                            className="address-modal__modal-content__description__name"
                            title="Дата начала"
                            value={this.state.form.startDate}
                            onEnd={(ok, value) =>
                                this.handleUpdateForm("startDate", value)
                            }
                        />
                        <TextField
                            type="datetime-local"
                            className="address-modal__modal-content__description__name"
                            title="Дата окончания"
                            value={this.state.form.endDate}
                            onEnd={(ok, value) =>
                                this.handleUpdateForm("endDate", value)
                            }
                        />
                    </p>
                    <div className="promocode-modal__modal-content__actions">
                        <Button
                            className="promocode-modal__modal__actions__save"
                            title="Добавить промокод"
                            disabled={!(this.state.form.name && this.state.form.percent && this.state.form.startDate && this.state.form.endDate)}
                            onClick={() => {
                                if (this.state.form.name && this.state.form.percent && this.state.form.startDate && this.state.form.endDate) {
                                    const dt1 = new Date(this.state.form.startDate);
                                    const dt2 = new Date(this.state.form.endDate);
                                    if (dt1.getTime() < dt2.getTime()) {
                                        props.onFinish({
                                            name: this.state.form.name,
                                            percent: this.state.form.percent,
                                            start: dt1,
                                            end: dt2
                                        });
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default PromocodeModal;
