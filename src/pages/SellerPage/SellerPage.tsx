import Tarakan, { Reference } from "bazaar-tarakan";
import SellerHeader from "../../components/SellerHeader/SellerHeader";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";
import { Product } from "../../api/product";
import InfinityList from "../../components/InfinityList/InfinityList";
import {
    addProductImage,
    addProductInformation,
    getSellerProducts,
} from "../../api/seller";
import { AJAXErrors } from "../../api/errors";
import { convertMoney } from "../AdminPage/AdminPage";
import ProductModal from "../../components/ProductModal/ProductModal";
import Button from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import TextArea from "../../components/TextArea/TextArea";
import { ValidTypes } from "bazaar-validation";
import CategorySelect from "../../components/CategorySelect/CategorySelect";

class SellerPage extends Tarakan.Component {
    state = {
        products: [],
        fetching: false,
        addProduct: false,

        productModal: new Reference(),
        selectedProduct: null,

        error: "",

        productForm: {
            name: "",
            description: "",
            price: "",
            quantity: "",
            category: "",
            image: null,
            imageFile: null,
        },
    };

    async fetchProducts() {
        if (this.state.fetching) return;
        this.state.fetching = true;

        const { code, products } = await getSellerProducts(
            this.state.products.length,
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                products: [...this.state.products, ...products],
                fetching: false,
            });
        }
    }

    handleUploadImage(ev: any) {
        const reader = new FileReader();
        reader.onload = () => {
            this.setState({
                productForm: {
                    ...this.state.productForm,
                    image: reader.result,
                    imageFile: ev.target.files[0],
                },
            });
        };
        reader.readAsDataURL(ev.target.files[0]);
    }

    async handleSendProduct() {
        const form = this.state.productForm;
        if (Number.isInteger(form.price) && parseInt(form.price) > 0) {
            this.setState({ error: "Цена не может быть отрицательной" });
            return;
        }

        if (Number.isInteger(form.quantity) && parseInt(form.quantity) > 0) {
            this.setState({
                error: "Количество товаров не может быть отрицательной",
            });
            return;
        }

        if (!form.name || !form.description || !form.image || !form.category) {
            this.setState({
                error: "Заполните все поля формы, выберите категорию и приложите фото",
            });
            return;
        }

        const { code, productId } = await addProductInformation({
            name: form.name,
            description: form.description,
            price: parseInt(form.price),
            quantity: parseInt(form.quantity),
            sellerId: this.app.store.user.id,
            category: form.category,
        });

        if (code === AJAXErrors.NoError) {
            const imageCode = await addProductImage(productId, form.imageFile);
            if (imageCode === AJAXErrors.NoError) {
                this.state.products = [];
                this.fetchProducts();
                this.setState({ addProduct: false });
            }
        }
    }

    init() {
        this.fetchProducts();
    }

    render() {
        return (
            <div className="seller-page">
                <SellerHeader />
                <main className="seller-page__content">
                    {!this.state.addProduct ? (
                        <div className="seller-page__content__products">
                            <div className="seller-page__content__products__title">
                                <h1 className="seller-page__content__products__title__h">
                                    Товары на продаже
                                </h1>
                                <Button
                                    title="Добавить товар"
                                    onClick={() =>
                                        this.setState({ addProduct: true })
                                    }
                                />
                            </div>

                            <table className="seller-page__content__products__table">
                                <thead>
                                    <tr>
                                        <th width="25%">Название</th>
                                        <th width="35%">Описание</th>
                                        <th width="10%">Цена</th>
                                        <th width="10%">В наличии</th>
                                        <th width="10%">Статус</th>
                                        <th width="10%"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.products !== null &&
                                    this.state.products.length ? (
                                        this.state.products.map(
                                            (product: Product) => (
                                                <tr>
                                                    <td className="ellipsis">
                                                        <span>
                                                            {product.name}
                                                        </span>
                                                    </td>
                                                    <td className="ellipsis">
                                                        <span>
                                                            {
                                                                product.description
                                                            }
                                                        </span>
                                                    </td>
                                                    <td style="max-width: 10%">
                                                        {convertMoney(
                                                            product.price,
                                                        )}
                                                    </td>
                                                    <td style="max-width: 10%">
                                                        {product.quantity} шт
                                                    </td>
                                                    <td
                                                        style="max-width: 10%"
                                                        className={
                                                            "status " +
                                                            product.status
                                                        }
                                                    >
                                                        <span>
                                                            {
                                                                {
                                                                    pending:
                                                                        "Ожидание",
                                                                    empty: "Закончился",
                                                                    approved:
                                                                        "В продаже",
                                                                    rejected:
                                                                        "Отказано",
                                                                }[
                                                                    product
                                                                        .status
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                    <td
                                                        style="max-width: 10%"
                                                        className="link"
                                                        onClick={() => {
                                                            this.setState({
                                                                selectedProduct:
                                                                    product,
                                                            });
                                                            this.state.productModal.target.handleOpen();
                                                        }}
                                                    >
                                                        Подробнее
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan="6">
                                                Пока вы не выложили товар на
                                                продажу
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <ProductModal
                                ref={this.state.productModal}
                                product={this.state.selectedProduct}
                            />
                            <InfinityList onShow={() => this.fetchProducts()} />
                        </div>
                    ) : (
                        <div className="seller-page__content__new-product">
                            <h1 className="seller-page__content__new-product__h">
                                Добавить товар
                            </h1>
                            <div className="seller-page__content__new-product__options">
                                <div className="seller-page__content__new-product__options__description">
                                    <h3>Информация</h3>
                                    <TextField
                                        title="Название"
                                        validType={ValidTypes.NotNullValid}
                                        onChange={(ev: any) =>
                                            this.setState({
                                                productForm: {
                                                    ...this.state.productForm,
                                                    name: ev.target.value,
                                                },
                                            })
                                        }
                                    />
                                    <TextArea
                                        className="seller-page__content__new-product__options__description__desc"
                                        title="Описание"
                                        validType={ValidTypes.NotNullValid}
                                        onChange={(ev: any) =>
                                            this.setState({
                                                productForm: {
                                                    ...this.state.productForm,
                                                    description:
                                                        ev.target.value,
                                                },
                                            })
                                        }
                                    />
                                    <div className="seller-page__content__new-product__options__description__count">
                                        <TextField
                                            type="number"
                                            title="Цена товара"
                                            validType={ValidTypes.NotNullValid}
                                            onChange={(ev: any) =>
                                                this.setState({
                                                    productForm: {
                                                        ...this.state
                                                            .productForm,
                                                        price: ev.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <TextField
                                            type="number"
                                            title="Доступное количество"
                                            validType={ValidTypes.NotNullValid}
                                            onChange={(ev: any) =>
                                                this.setState({
                                                    productForm: {
                                                        ...this.state
                                                            .productForm,
                                                        quantity:
                                                            ev.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="seller-page__content__new-product__options__image">
                                    <h3>Изображение</h3>
                                    <label
                                        className="seller-page__content__new-product__options__image__ico"
                                        style={
                                            this.state.productForm.image
                                                ? "border: none"
                                                : ""
                                        }
                                    >
                                        <input
                                            type="file"
                                            accept=".jpg,.png"
                                            style="display:none"
                                            onChange={(ev) =>
                                                this.handleUploadImage(ev)
                                            }
                                        />
                                        {this.state.productForm.image ? (
                                            <img
                                                className="seller-page__content__new-product__options__image__ico__img"
                                                src={
                                                    this.state.productForm.image
                                                }
                                            />
                                        ) : (
                                            <div className="seller-page__content__new-product__options__image__ico__title">
                                                Загрузите
                                                <br />
                                                изображение
                                                <br />
                                                товара
                                            </div>
                                        )}
                                    </label>
                                    <CategorySelect
                                        className="seller-page__content__new-product__options__image__category"
                                        onSelect={(id) =>
                                            this.setState({
                                                productForm: {
                                                    ...this.state.productForm,
                                                    category: id,
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="seller-page__content__new-product__actions">
                                <Button
                                    className="seller-page__content__new-product__actions__btn"
                                    title="Выставить товар на продажу"
                                    disabled={
                                        !this.state.productForm.name ||
                                        !this.state.productForm.description ||
                                        !this.state.productForm.price ||
                                        !this.state.productForm.quantity ||
                                        !this.state.productForm.image ||
                                        !this.state.productForm.category
                                    }
                                    onClick={() => this.handleSendProduct()}
                                />
                                <span className="seller-page__content__new-product__actions__error">
                                    {this.state.error}
                                </span>
                            </div>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        );
    }
}

export default SellerPage;
