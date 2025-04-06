import Tarakan from "../../../modules/tarakan";
import Header from "../../new_components/Header/Header.jsx";
import Footer from "../../new_components/Footer/Footer.jsx";
import ajax from "../../../modules/ajax.js";
import ProductCard from "../../new_components/ProductCard/ProductCard.jsx";
import {SERVER_URL} from "../../settings.js";

import "./styles.scss";

class IndexPage extends Tarakan.Component {

    state = {
        products: [],
    }

    async fetchProducts() {
        const response = await ajax.get("api/products/", {origin: SERVER_URL});

        if (response.result.ok) {
            const data = await response.result.json();

            this.setState({
                products: data.products.map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    reviews_count: item.reviews_count,
                    rating: item.rating,
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
                            (item, index) =>
                                <ProductCard
                                    price={`${item.price}`}
                                    title={`${item.name}`}
                                    rating={`${item.rating}`}
                                    reviewsCount={`${item.reviews_count}`}
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