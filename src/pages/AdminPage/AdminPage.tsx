import Tarakan, { Reference } from "bazaar-tarakan";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";
import UserRequestModal from "../../components/UserRequestModal/UserRequestModal";
import {
    createPromocode,
    getProductsRequests,
    getPromocodes,
    getUserRequests,
    ProductRequest,
    sendProductRequestAnswer,
    sendUserRequestAnswer,
    UserRequest,
} from "../../api/admin";
import { AJAXErrors } from "../../api/errors";
import InfinityList from "../../components/InfinityList/InfinityList";
import ProductRequestModal from "../../components/ProductRequestModal/ProductRequestModal";
import { getProduct } from "../../api/product";
import Button from "../../components/Button/Button";
import PromocodeModal from "../../components/PromocodeModal/PromocodeModal";

export function convertMoney(rawData: string | number) {
    const data = rawData.toString();
    const result =
        data.length % 3 === 0 ? [] : [data.slice(0, data.length % 3)];
    for (let i = data.length % 3; i < data.length; i += 3) {
        result.push(data.slice(i, i + 3));
    }
    return result.join(" ") + " ₽";
}

class AdminPage extends Tarakan.Component {
    state = {
        tabOpened: "sellers",

        productsFetch: false,
        sellersFetch: false,

        sellerInfoModalRef: new Reference(),
        productInfoModalRef: new Reference(),

        sellers: undefined,
        selectedRequest: null,

        products: undefined,
        selectedProduct: null,

        fetchDone: false,

        createPromocode: false,
        promocodes: null,
        promocodesFetch: false,
    };

    fetchNextRequests() {
        if (this.state.tabOpened === "sellers") {
            this.fetchUserRequests();
        }
        if (this.state.tabOpened === "products") {
            this.fetchUserRequests();
        }
        if (this.state.tabOpened === "promocode") {
            this.fetchPromocodes(true);
        }
    }

    async fetchUserRequests() {
        if (this.state.sellersFetch) return;
        this.state.sellersFetch = true;
        const { code, requests } = await getUserRequests(
            this.state.sellers?.length ?? 0,
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                sellers: [...(this.state.sellers ?? []), ...requests],
                sellersFetch: false,
            });
        } else {
            this.app.navigateTo("/");
        }
    }

    async fetchProductsRequests() {
        if (this.state.productsFetch) return;
        this.state.productsFetch = true;
        const { code, requests } = await getProductsRequests(
            this.state.products?.length ?? 0,
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                products: [...(this.state.products ?? []), ...requests],
                productsFetch: false,
            });
        } else {
            this.app.navigateTo("/");
        }
    }

    async sendUserAnswer(accepted: boolean) {
        const code = await sendUserRequestAnswer(
            this.state.selectedRequest.id,
            accepted,
        );
        if (code === AJAXErrors.NoError) {
            this.state.sellerInfoModalRef.target.handleClose();
            this.setState({
                sellers: this.state.sellers.filter(
                    (request) => request.id !== this.state.selectedRequest.id,
                ),
            });
        }
    }

    async sendProductAnswer(accepted: boolean) {
        const code = await sendProductRequestAnswer(
            this.state.selectedProduct.id,
            accepted,
        );
        if (code === AJAXErrors.NoError) {
            this.state.productInfoModalRef.target.handleClose();
            this.setState({
                products: this.state.products.filter(
                    (request) => request.id !== this.state.selectedProduct.id,
                ),
            });
        }
    }

    handleOpenTab() {
        const newTab = this.app.urlParams.tab ?? "sellers";
        if (newTab === "sellers" && !this.state.sellers) {
            this.fetchUserRequests();
        }
        if (newTab === "products" && !this.state.products) {
            this.fetchProductsRequests();
        }
        if (newTab === "promocode" && !this.state.promocodes) {
            this.fetchPromocodes(true);
        }
        this.setState({ tabOpened: newTab, fetchDone: false });
    }

    async handleShowProduct(request: ProductRequest) {
        const { code, product } = await getProduct(request.id);
        if (code === AJAXErrors.NoError) {
            this.setState({ selectedProduct: product });
            this.state.productInfoModalRef.target.handleOpen();
        }
    }

    async handleCreatePromocode(form) {
        const code = await createPromocode(
            form.name,
            form.percent,
            form.start,
            form.end,
        );
        if (code === AJAXErrors.NoError) {
            this.setState({ createPromocode: false });
            this.fetchPromocodes(true);
        }
    }

    async fetchPromocodes(start: boolean = false) {
        if (this.state.promocodesFetch) return;
        this.state.promocodesFetch = true;
        const { code, data } = await getPromocodes(
            start ? 0 : this.state.promocodes.length,
        );
        console.log(data);
        if (code === AJAXErrors.NoError) {
            this.setState({
                promocodes: start
                    ? data
                    : [...(this.state.promocodes ?? []), ...data],
                promocodesFetch: false,
            });
        }
    }

    renderFinished() {
        this.handleOpenTab();
    }

    update() {
        this.handleOpenTab();
    }

    render() {
        return (
            <div className="admin-page">
                <AdminHeader />
                <main className="admin-page__content">
                    <div
                        className="admin-page__content__sellers"
                        hidden={this.state.tabOpened !== "sellers"}
                    >
                        <h1 className="admin-page__content__sellers__h">
                            Заявки продавцов
                        </h1>
                        <table className="admin-page__content__sellers__table">
                            <thead>
                                <tr>
                                    <th width="15%">Название</th>
                                    <th width="30%">Описание</th>
                                    <th width="25%">Имя владельца</th>
                                    <th width="20%">Email владельца</th>
                                    <th width="10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.sellers &&
                                this.state.sellers.length ? (
                                    this.state.sellers.map(
                                        (request: UserRequest) => (
                                            <tr>
                                                <td>
                                                    {request.sellerInfo.title}
                                                </td>
                                                <td>
                                                    {
                                                        request.sellerInfo
                                                            .description
                                                    }
                                                </td>
                                                <td>
                                                    {`${request.surname ?? ""} ${request.name}`.trim()}
                                                </td>
                                                <td>{request.email}</td>
                                                <td
                                                    className="link"
                                                    onClick={() => {
                                                        this.setState({
                                                            selectedRequest:
                                                                request,
                                                        });
                                                        this.state.sellerInfoModalRef.target.handleOpen();
                                                    }}
                                                >
                                                    Подробнее
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            Все заявки рассмотрены, можно теперь
                                            и кофейку выпить &#9749;
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <InfinityList onShow={() => this.fetchNextRequests()} />
                        <UserRequestModal
                            ref={this.state.sellerInfoModalRef}
                            request={this.state.selectedRequest}
                            onSuccess={() => this.sendUserAnswer(true)}
                            onDenied={() => this.sendUserAnswer(false)}
                        />
                    </div>
                    <div
                        className="admin-page__content__products"
                        hidden={this.state.tabOpened !== "products"}
                    >
                        <h1 className="admin-page__content__products__h">
                            Заявки на выставление товаров
                        </h1>
                        <table className="admin-page__content__products__table">
                            <thead>
                                <tr>
                                    <th width="60%">Название</th>
                                    <th width="30%">Цена</th>
                                    <th width="10%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products?.length > 0 ? (
                                    this.state.products.map(
                                        (request: ProductRequest) => (
                                            <tr>
                                                <td>{request.name}</td>
                                                <td>
                                                    {convertMoney(
                                                        request.price,
                                                    )}
                                                </td>
                                                <td
                                                    className="link"
                                                    onClick={() =>
                                                        this.handleShowProduct(
                                                            request,
                                                        )
                                                    }
                                                >
                                                    Подробнее
                                                </td>
                                            </tr>
                                        ),
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            Все заявки рассмотрены, можешь
                                            теперь и кофейку выпить &#9749;
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <InfinityList
                            onShow={() =>
                                this.state.fetchDone && this.fetchNextRequests()
                            }
                        />
                        <ProductRequestModal
                            ref={this.state.productInfoModalRef}
                            request={this.state.selectedProduct}
                            onSuccess={() => this.sendProductAnswer(true)}
                            onDenied={() => this.sendProductAnswer(false)}
                        />
                    </div>
                    <div
                        className="admin-page__content__promocode"
                        hidden={this.state.tabOpened !== "promocode"}
                    >
                        <h1 className="admin-page__content__promocode__h">
                            Промокоды
                            <Button
                                title="Создать промокод"
                                onClick={() =>
                                    this.setState({ createPromocode: true })
                                }
                            />
                        </h1>
                        <div className="admin-page__content__promocode__promocodes">
                            {(this.state.promocodes ?? []).map((promocode) => (
                                <div className="admin-page__content__promocode__promocodes__item">
                                    <div className="admin-page__content__promocode__promocodes__item__percent">
                                        {promocode.percent} %
                                    </div>
                                    <div className="admin-page__content__promocode__promocodes__item__code">
                                        {promocode.code}
                                    </div>
                                    <div className="admin-page__content__promocode__promocodes__item__date">
                                        <span className="t">
                                            Действителен с
                                        </span>
                                        <span className="v">
                                            {new Date(
                                                promocode.startDate,
                                            ).toLocaleString()}
                                        </span>
                                        <span className="t">по</span>
                                        <span className="v">
                                            {new Date(
                                                promocode.endDate,
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <InfinityList onShow={() => this.fetchPromocodes()} />
                        {this.state.createPromocode && (
                            <PromocodeModal
                                onFinish={(form) => {
                                    this.handleCreatePromocode(form);
                                }}
                                onClose={() =>
                                    this.setState({ createPromocode: false })
                                }
                            />
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
}

export default AdminPage;
