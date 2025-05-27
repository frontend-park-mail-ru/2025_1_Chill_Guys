import Tarakan, { Reference } from "bazaar-tarakan";
import Button from "../../components/Button/Button";

import "./styles.scss";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PaymentType from "../../components/PaymentType/PaymentType";

import spbIcon from "../../shared/images/cbp-ico.svg";
import moneyIcon from "../../shared/images/money-ico.svg";
import loadingIcon from "../../shared/images/loading-ico.svg";

import AddressCard from "../../components/AddressCard/AddressCard";
import AddressModal from "../../components/AddressModal/AddressModal";

import { AJAXErrors } from "../../api/errors";
import { calculateOrderParams, sendOrder } from "../../api/order";
import { getUserAddresses } from "../../api/address";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import TextField from "../../components/TextField/TextField";

import { checkPromocode } from "../../api/promocode";

class PlaceOrderPage extends Tarakan.Component {
    state = {
        total: 0,
        discount: 0,
        activeAddress: "",
        addAddressModalOpened: false,
        addresses: [],
        successMessageOpened: false,

        promocode: "",
        promocodePercent: null,
        promocodeTextField: new Reference(),
        promocodeSuccessStatus: 0,
    };

    showBeautifulNumber(value: number) {
        return (value).toLocaleString('ru');
    }

    async fetchOrder() {
        const { code, parametres } = await calculateOrderParams();
        if (code === AJAXErrors.NoError) {
            this.setState({
                total: parametres.price,
                discount: parametres.discountPrice,
            });
        } else {
            this.app.navigateTo("/signin");
        }
    }

    async fetchAddresses() {
        const { code, addresses } = await getUserAddresses();
        if (code === AJAXErrors.NoError) {
            this.setState({
                addAddressModalOpened: false,
                addresses: addresses,
            });
        } else {
            this.app.navigateTo("/signin");
        }
    }

    async handlePlaceOrder() {
        const code = await sendOrder({
            payType: "money",
            address: this.state.activeAddress,
            promocode: this.state.promocode,
        });

        if (code === AJAXErrors.NoError) {
            this.setState({
                successMessageOpened: true,
            });
            this.app.store.user.sendAction("getNofitications");
        }
    }

    async handleCheckPromocode() {
        this.state.promocodeTextField.target.changeStatus("default");
        this.setState({ promocodeSuccessStatus: 1 });
        const { code, data } = await checkPromocode(this.state.promocode);
        if (code === AJAXErrors.NoError) {
            if (data.valid) {
                this.state.promocodeTextField.target.changeStatus("success");
                this.setState({
                    promocodeSuccessStatus: 3,
                    promocodePercent: data.percent,
                });
            } else {
                this.state.promocodeTextField.target.changeStatus("invalid");
                this.setState({
                    promocodeSuccessStatus: 2,
                    promocodePercent: null,
                });
            }
        }
    }

    async handleChangePromocode(newPromocode) {
        this.state.promocodeTextField.target.changeStatus("default");
        this.setState({ promocodeSuccessStatus: 0, promocode: newPromocode });
    }

    init() {
        this.fetchOrder();
        this.fetchAddresses();
    }

    render() {
        return (
            <div className="place-order-page">
                {this.state.successMessageOpened && <SuccessModal />}
                <Header />
                <main>
                    <h1>Оформление заказа</h1>
                    <div className="content">
                        <div className="content__settings">
                            <h2>Способ оплаты</h2>
                            <div className="content__settings__payment-types">
                                <PaymentType
                                    icon={moneyIcon}
                                    name="Наличными"
                                    active={true}
                                />
                                <PaymentType
                                    icon={spbIcon}
                                    name="СПБ"
                                    disabled={true}
                                />
                            </div>
                            <div className="content__settings__promocode">
                                <h2>Промокод</h2>
                                <div className="content__settings__promocode__value">
                                    <TextField
                                        ref={this.state.promocodeTextField}
                                        title="Промокод"
                                        onChange={(v) =>
                                            this.handleChangePromocode(
                                                v.target.value,
                                            )
                                        }
                                    />
                                    <Button
                                        title="Проверить"
                                        disabled={
                                            this.state.promocodeSuccessStatus %
                                                2 !==
                                                0 || this.state.promocode == ""
                                        }
                                        onClick={() =>
                                            this.handleCheckPromocode()
                                        }
                                    />
                                    {this.state.promocodeSuccessStatus ===
                                        1 && (
                                        <img
                                            className="content__settings__promocode__value__loading"
                                            src={loadingIcon}
                                        />
                                    )}
                                </div>
                                {this.state.promocodeSuccessStatus === 2 && (
                                    <div style="color: red">
                                        Промокод не найден или недействителен
                                    </div>
                                )}
                            </div>
                            <div className="content__settings__address-title">
                                <h2>Адрес доставки</h2>
                                <Button
                                    className="content__settings__address-title__add-address-button"
                                    title="Добавить адрес"
                                    variant="text"
                                    onClick={() =>
                                        this.setState({
                                            addAddressModalOpened: true,
                                        })
                                    }
                                />
                            </div>
                            <div className="content__settings__addresses">
                                {this.state.addresses.map((address) => (
                                    <AddressCard
                                        name={address.label}
                                        address={address.addressString}
                                        active={
                                            this.state.activeAddress ===
                                            address.id
                                        }
                                        onClick={() =>
                                            this.setState({
                                                activeAddress: address.id,
                                            })
                                        }
                                    />
                                ))}
                                {this.state.addresses.length === 0 && (
                                    <div className="content__settings__addresses_no-address">
                                        У вас пока нет ни одного адреса доставки
                                    </div>
                                )}
                            </div>
                            <div className="content__settings__date">
                                <h2>Срок доставки:</h2>5 рабочих дней
                            </div>
                            {this.state.addAddressModalOpened && (
                                <AddressModal
                                    opened={this.state.addAddressModalOpened}
                                    onEnd={(ok) => {
                                        if (ok) {
                                            this.fetchAddresses();
                                        } else {
                                            this.setState({
                                                addAddressModalOpened: false,
                                            });
                                        }
                                    }}
                                    onClose={() => {
                                        this.setState({
                                            addAddressModalOpened: false,
                                        });
                                    }}
                                />
                            )}
                        </div>
                        <div className="content__total">
                            <Button
                                className="content__total__make-order"
                                title="Оформление заказа"
                                disabled={this.state.activeAddress === ""}
                                onClick={() => this.handlePlaceOrder()}
                            />
                            {this.state.total != this.state.discount && (
                                <div className="content__total__discount">
                                    <span>Скидка:</span>
                                    <span className="content__total__discount_cost">
                                        {this.showBeautifulNumber(this.state.total - this.state.discount)}&nbsp;₽
                                    </span>
                                </div>
                            )}
                            {this.state.promocodePercent && (
                                <div className="content__total__promocode">
                                    <span>Промокод:</span>
                                    <span className="content__total__promocode_cost">
                                        -{this.state.promocodePercent} %
                                    </span>
                                </div>
                            )}
                            <div className="content__total__sum-cost">
                                <span>Итог:</span>
                                <span className="content__total__sum-cost_cost">
                                    {this.showBeautifulNumber(parseInt(
                                        (this.state.discount *
                                            (100 -
                                                (this.state.promocodePercent ??
                                                    0))) /
                                            100 +
                                            "",
                                    ))}&nbsp;₽
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

export default PlaceOrderPage;
