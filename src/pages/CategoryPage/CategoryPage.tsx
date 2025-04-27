import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getProductsByCategory } from "../../api/product";
import { AJAXErrors } from "../../api/errors";
import { getBasket } from "../../api/basket";
import { getAllCategories } from "../../api/categories";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./styles.scss";
import CSAT from "../CSAT/CSAT";

export default class CategoryPage extends Tarakan.Component {

    state = {
        products: [],
        category: {
            id: undefined,
            name: undefined,
        },
        csat: false,
    }

    init() {
        this.fetchProducts();
        this.fetchCategory();
        // setTimeout => this.setState({ csat: true }), 10000);
    }

    update(newProps: any) {
        this.fetchProducts();
        this.fetchCategory();
    }

    async fetchCategory() {
        const categories = await getAllCategories();
        if (categories.code === AJAXErrors.NoError) {
            for (const category of categories.data.categories) {
                if (category.id === this.app.urlParams.id) {
                    this.setState({ category: category });
                    break;
                }
            }
        }
    }

    async fetchProducts() {
        const productsResponse = await getProductsByCategory(this.app.urlParams.id);
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

            this.setState({
                products: products.map((item) => ({
                    ...item,
                    isInCart: basket.has(item.id),
                }))
            })
        }
    }

    render(props, router) {

        return <div className="container">
            <Header />
            {this.state.csat && <CSAT id="Category" />}
            <main className="category-page category-page_flex category-page_flex_column">
                <h1 className="h-reset category-page__main-h1">{this.state.category.name ?? "Товары"}</h1>
                <div className="category-page__cards-container">
                    {
                        this.state.products.map((item) =>
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
                            />
                        )
                    }
                </div>
            </main>
            <Footer />
        </div>
    }
}
