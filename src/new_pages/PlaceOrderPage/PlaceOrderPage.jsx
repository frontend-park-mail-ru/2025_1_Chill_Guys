import Tarakan from "../../../modules/tarakan";
import Button from "../../new_components/Button/Button.jsx";
import { SERVER_URL } from "../../settings";
import "./styles.scss";

import ajax from "../../../modules/ajax.js";
import Header from "../../new_components/Header/Header.jsx";
import Footer from "../../new_components/Footer/Footer.jsx";
import PaymentType from "../../new_components/PaymentType/PaymentType.jsx";

import spbIcon from "../../shared/images/cbp-ico.svg";
import moneyIcon from "../../shared/images/money-ico.svg";
import AddressCard from "../../new_components/AddressCard/AddressCard.jsx";
import AddressModal from "../../new_components/AddressModal/AddressModal.jsx";

class PlaceOrderPage extends Tarakan.Component {

    state = {
        total: 0,
        discount: 0,
        activeAddress: "1",
        addAddressModalOpened: true,
        addresses: []
    }

    render(props, router) {
        return <div className="place-order-page">
            <Header />
            <main>
                <h1>Оформление заказа</h1>
                <div className="content">
                    <div className="settings">
                        <h2>Способ оплаты</h2>
                        <div className="payment-types">
                            <PaymentType icon={moneyIcon} name="Наличными" active={true} />
                            <PaymentType icon={spbIcon} name="СПБ" disabled={true} />
                        </div>
                        <div className="address-title">
                            <h2>Адрес доставки</h2>
                            <Button
                                className="add-address-button"
                                title="Добавить адрес"
                                variant="text"
                                onClick={() => this.setState({ addAddressModalOpened: true })}
                            />
                        </div>
                        <div className="addresses">
                            {
                                this.state.addresses.map((address) =>
                                    <AddressCard
                                        name={address.name}
                                        address={
                                            `${address.city}, ${address.street}, д. ${address.house}, к. ${address.housing}, кв. ${address.flat}`
                                        }
                                        active={this.state.activeAddress === address.id}
                                        onClick={() => this.setState({ activeAddress: address.id })}
                                    />
                                )
                            }
                            {
                                this.state.addresses.length === 0 && <div className="no-address">
                                    У вас пока нет ни одного адреса доставки
                                </div>
                            }
                        </div>
                        {this.state.addAddressModalOpened && <AddressModal
                            opened={this.state.addAddressModalOpened}
                            onEnd={(form) => {
                                this.setState({
                                    addAddressModalOpened: false,
                                    addresses: [
                                        ...this.state.addresses,
                                        form
                                    ]
                                });
                            }}
                            onClose={() => {
                                console.log("YES")
                                this.setState({ addAddressModalOpened: false });
                            }}
                        />}
                    </div>
                    <div className="total">
                        <Button
                            className="make-order"
                            title="Оформление заказа"
                            onClick={() => router.navigateTo("/place-order")}
                        />
                        <div className="comment">
                            Способы оплаты и доставки будут доступны на следующем шаге
                        </div>
                        <div className="discount">
                            <span>Скидка:</span>
                            <span className="cost">{this.state.total - this.state.discount} ₽</span>
                        </div>
                        <div className="sum-cost">
                            <span>Итог:</span>
                            <span className="cost">{this.state.discount} ₽</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default PlaceOrderPage;