import Tarakan from "bazaar-tarakan";
import Button from "../../components/Button/Button";

import "./styles.scss";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PaymentType from "../../components/PaymentType/PaymentType";

import spbIcon from "../../shared/images/cbp-ico.svg";
import moneyIcon from "../../shared/images/money-ico.svg";
import AddressCard from "../../components/AddressCard/AddressCard";
import AddressModal from "../../components/AddressModal/AddressModal";

import { AJAXErrors } from "../../api/errors";
import { calculateOrderParams, sendOrder } from "../../api/order";
import { getUserAddresses } from "../../api/address";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

class PlaceOrderPage extends Tarakan.Component {

    state = {
        total: 0,
        discount: 0,
        activeAddress: "",
        addAddressModalOpened: false,
        addresses: [],
        successMessageOpened: false,
    }

    async fetchOrder() {
        const { code, parametres } = await calculateOrderParams();
        if (code === AJAXErrors.NoError) {
            this.setState({
                total: parametres.price,
                discount: parametres.discountPrice
            })
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
            })
        } else {
            this.app.navigateTo("/signin");
        }
    }

    async handlePlaceOrder() {
        const code = await sendOrder({
            payType: "money",
            address: this.state.activeAddress
        });

        if (code === AJAXErrors.NoError) {
            this.setState({
                successMessageOpened: true
            });
        }
    }

    init() {
        this.fetchOrder();
        this.fetchAddresses();
    }

    render() {
        return <div className="place-order-page">
            {
                this.state.successMessageOpened && <SuccessModal />
            }
            <Header />
            <main>
                <h1>Оформление заказа</h1>
                <div className="content">
                    <div className="content__settings">
                        <h2>Способ оплаты</h2>
                        <div className="content__settings__payment-types">
                            <PaymentType icon={moneyIcon} name="Наличными" active={true} />
                            <PaymentType icon={spbIcon} name="СПБ" disabled={true} />
                        </div>
                        <div className="content__settings__address-title">
                            <h2>Адрес доставки</h2>
                            <Button
                                className="content__settings__address-title__add-address-button"
                                title="Добавить адрес"
                                variant="text"
                                onClick={() => this.setState({ addAddressModalOpened: true })}
                            />
                        </div>
                        <div className="content__settings__addresses">
                            {
                                this.state.addresses.map((address) =>
                                    <AddressCard
                                        name={address.label}
                                        address={address.addressString}
                                        active={this.state.activeAddress === address.id}
                                        onClick={() => this.setState({ activeAddress: address.id })}
                                    />
                                )
                            }
                            {
                                this.state.addresses.length === 0 &&
                                <div className="content__settings__addresses_no-address">
                                    У вас пока нет ни одного адреса доставки
                                </div>
                            }
                        </div>
                        <div className="content__settings__date">
                            <h2>Срок доставки:</h2>
                            5 рабочик дней
                        </div>
                        {this.state.addAddressModalOpened && <AddressModal
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
                                this.setState({ addAddressModalOpened: false });
                            }}
                        />}
                    </div>
                    <div className="content__total">
                        <Button
                            className="content__total__make-order"
                            title="Оформление заказа"
                            disabled={this.state.activeAddress === ""}
                            onClick={() => this.handlePlaceOrder()}
                        />
                        <div className="content__total__discount">
                            <span>Скидка:</span>
                            <span className="content__total__discount_cost">{this.state.total - this.state.discount} ₽</span>
                        </div>
                        <div className="content__total__sum-cost">
                            <span>Итог:</span>
                            <span className="content__total__sum-cost_cost">{this.state.discount} ₽</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default PlaceOrderPage;