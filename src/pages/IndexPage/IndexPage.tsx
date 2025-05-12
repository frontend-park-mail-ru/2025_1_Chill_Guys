import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./styles.scss";
import { getProducts } from "../../api/product";
import { getBasket } from "../../api/basket";
import { AJAXErrors } from "../../api/errors";
import Alert from "../../components/Alert/Alert";
import InfinityList from "../../components/InfinityList/InfinityList";
import AdBanner from "../../components/AdBanner/AdBanner";

class IndexPage extends Tarakan.Component {
    state = {
        products: [{ end: true }],
        fetching: false,
        basket: null,
        showNotAuthAlert: false,
        offset: 0,
    };

    applyAd(newProducts: any[]) {
        if (newProducts.length < 10) {
            return newProducts;
        }
        const i = Math.trunc(Math.random() * (newProducts.length - 10) + 5);
        return [
            ...newProducts.slice(0, i),
            {
                ad: true,
                url: "https://bazaar-techpark.ru/ad/banner/uniq_link/60",
            },
            ...newProducts.slice(i),
        ];
    }

    async fetchProducts() {
        if (this.state.fetching) return;
        this.state.fetching = true;

        const productsResponse = await getProducts(this.state.offset);

        let basket = this.state.basket;

        if (basket === null) {
            const basketResponse = await getBasket();
            if (basketResponse.code === AJAXErrors.NoError) {
                basket = new Set();
                basketResponse.data.products.map((item) => {
                    basket.add(item.productId);
                });
            }
        }

        if (productsResponse.code === AJAXErrors.NoError) {
            const products = productsResponse.products;
            this.setState({
                basket: basket || new Set(),
                products: [
                    ...this.state.products.slice(
                        0,
                        this.state.products.length - 1,
                    ),
                    ...this.applyAd(
                        products.map((item) => ({
                            id: item.id,
                            name: item.name,
                            image: item.image,
                            price: item.price,
                            discountPrice: item.discountPrice,
                            reviewsCount: item.reviewsCount,
                            rating: item.rating,
                            isInCart: basket ? basket.has(item.id) : false,
                        })),
                    ),
                    { end: true },
                ],
                offset: this.state.offset + products.length,
                fetching: false,
            });
        } else {
            this.state.fetching = false;
        }
    }

    init() {
        this.fetchProducts();
    }

    render(props, router) {
        return (
            <div className={`container`}>
                <Header />
                <main
                    className={`index-page index-page_flex index-page_flex_column`}
                >
                    {this.state.showNotAuthAlert && (
                        <Alert
                            title="Необходимо войти"
                            content="Для добавления товаров в корзину, надо сначала войти в профиль."
                            successButtonTitle="Войти"
                            onSuccess={() => router.navigateTo("/signin")}
                            onClose={() =>
                                this.setState({ showNotAuthAlert: false })
                            }
                        />
                    )}
                    <h1 className={`index-page__main-h1`}>Весенние хиты</h1>
                    <div className={`index-page__cards-container`}>
                        {this.state.products.map((item: any) =>
                            !item.ad && !item.end ? (
                                <ProductCard
                                    id={`${item.id}`}
                                    inCart={item.isInCart}
                                    price={`${item.price}`}
                                    discountPrice={item.discountPrice}
                                    title={`${item.name}`}
                                    rating={`${item.rating}`}
                                    reviewsCount={`${item.reviewsCount}`}
                                    mainImageAlt={`Изображение товара ${item.name}`}
                                    mainImageSrc={item.image}
                                    onError={(err) => {
                                        if (err === AJAXErrors.Unauthorized) {
                                            this.setState({
                                                showNotAuthAlert: true,
                                            });
                                        }
                                    }}
                                />
                            ) : item.ad ? (
                                <AdBanner url={item.url} />
                            ) : (
                                <InfinityList
                                    onShow={() => this.fetchProducts()}
                                />
                            ),
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        );
    }
}

export default IndexPage;
