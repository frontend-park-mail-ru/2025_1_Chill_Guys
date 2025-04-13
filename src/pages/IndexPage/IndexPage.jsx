import Tarakan from "../../../modules/tarakan";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import ajax from "../../../modules/ajax.js";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { SERVER_URL } from "../../settings.js";

import "./styles.scss";
import { getProducts } from "../../api/product";
import { getBasket } from "../../api/basket";
import { AJAXErrors } from "../../api/errors";

class IndexPage extends Tarakan.Component {

    state = {
        products: [],
    }

    async fetchProducts() {
        const productsResponse = await getProducts();
        const basketResponse = await getBasket();

        if (productsResponse.code === AJAXErrors.NoError) {
            const products = productsResponse.products;

            let basket = new Set();
            if (basketResponse.code === AJAXErrors.NoError) {
                const data = basketResponse.data;
                data.products.map((item) => {
                    basket.add(item.productId);
                });
            }

            console.log(basket, products);

            this.setState({
                products: products.map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    reviewsCount: item.reviewsCount,
                    rating: item.rating,
                    isInCart: basket.has(item.id),
                }))
            })
        }
    }

    init() {
        this.fetchProducts();
    }

    render(props, router) {

        return <div className={`container`}>
            <Header />

            <main className={`index-page flex column`}>
                <h1 className={`h-reset main-h1`}>Весенние хиты</h1>
                <div className={`cards-container`}>
                    {
                        this.state.products.map(
                            (item) =>
                                <ProductCard
                                    id={`${item.id}`}
                                    inCart={item.isInCart}
                                    price={`${item.price}`}
                                    title={`${item.name}`}
                                    rating={`${item.rating}`}
                                    reviewsCount={`${item.reviewsCount}`}
                                    mainImageAlt={`Изображение товара ${item.name}`}
                                    mainImageSrc={`${SERVER_URL}/api/products/${item.id}/cover`}
                                />
                        )
                    }
                </div>
            </main>

            <Footer />
        </div>
    }
}

export default IndexPage;