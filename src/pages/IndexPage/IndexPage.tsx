import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";

import "./styles.scss";
import { getProducts } from "../../api/product";
import { getBasket } from "../../api/basket";
import { AJAXErrors } from "../../api/errors";
import SurveyPage from "../SurveyPage/SurveyPage";
import CSAT from "../CSAT/CSAT";
import Alert from "../../components/Alert/Alert";

class IndexPage extends Tarakan.Component {

    state = {
        products: [],
        csat: false,
        showNotAuthAlert: false,
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

            this.setState({
                products: products.map((item) => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    discountPrice: item.discountPrice,
                    reviewsCount: item.reviewsCount,
                    rating: item.rating,
                    isInCart: basket.has(item.id),
                }))
            })
        }
    }

    init() {
        this.fetchProducts();
        // setTimeout => this.setState({ csat: true }), 10000);
    }

    render(props, router) {
        return <div className={`container`}>
            <Header />
            <main className={`index-page index-page_flex index-page_flex_column`}>
                {this.state.csat && <CSAT id="Mainpage" />}
                {this.state.showNotAuthAlert && <Alert
                    title="Необходимо войти"
                    content="Для добавления товаров в корзину, надо сначала войти в профиль."
                    successButtonTitle="Войти"
                    onSuccess={() => router.navigateTo("/signin")}
                    onClose={() => this.setState({ showNotAuthAlert: false })}
                />}
                <h1 className={`index-page__main-h1`}>Весенние хиты</h1>
                <div className={`index-page__cards-container`}>
                    {
                        this.state.products.map(
                            (item) =>
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
                                            this.setState({ showNotAuthAlert: true });
                                        }
                                    }}
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