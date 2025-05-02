import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getProductsByCategory, getSearchResultByFilters } from "../../api/product";
import { AJAXErrors } from "../../api/errors";
import { getBasket } from "../../api/basket";
import { getAllCategories, getCategory, getSearchCategoryByFilters } from "../../api/categories";
import ProductCard from "../../components/ProductCard/ProductCard";

import CSAT from "../CSAT/CSAT";
import Alert from "../../components/Alert/Alert";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";

import SearchIcon from "../../shared/images/search-ico.svg";
import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";

import "./styles.scss";

export default class CategoryPage extends Tarakan.Component {


    init() {
        this.state = {
            products: [],
            category: {
                id: this.app.urlParams.id,
                name: undefined,
            },
            csat: false,
            showNotAuthAlert: false,

            searchString: this.app.queryParams.r ?? "",
            showFilters: (this.app.queryParams.s),
            filters: {
                starsHover: 0,
                minRating: this.app.queryParams.rt ?? 0,
                minPrice: this.app.queryParams.l ?? "",
                maxPrice: this.app.queryParams.h ?? "",
                sortType: this.app.queryParams.s ?? "default",
            },
        }
        this.fetchCategory();
        this.fetchSearchResult();
        // setTimeout => this.setState({ csat: true }), 10000);
    }

    update(newProps: any) {
        console.log(newProps);
        this.fetchCategory();
        this.fetchSearchResult();
    }

    async fetchCategory() {
        const categories = await getCategory(this.app.urlParams.id);
        if (categories.code === AJAXErrors.NoError) {
            this.setState({ category: categories.subcategory });
        }
    }

    handleSearch() {
        console.log(this.state.searchString)
        const request = {
            r: this.state.searchString,
        };
        if (this.state.showFilters) {
            if (this.state.filters.minRating) { request["rt"] = this.state.filters.minRating }
            if (this.state.filters.minPrice) { request["l"] = this.state.filters.minPrice }
            if (this.state.filters.maxPrice) { request["h"] = this.state.filters.maxPrice }
            if (this.state.filters.sortType) { request["s"] = this.state.filters.sortType }
        }
        this.app.navigateTo("/category/" + this.app.urlParams.id, request)
        this.fetchSearchResult();
    }

    async fetchSearchResult() {
        const { code, products } = await getSearchCategoryByFilters(
            this.app.urlParams.id,
            this.state.searchString,
            this.state.showFilters
                ? this.state.filters
                : {}
        );
        const basketResponse = await getBasket();
        if (code === AJAXErrors.NoError) {
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
        const searchString = router.queryParams.r ?? "";

        const sortType = router.queryParams.s ?? "default";
        const minPrice = router.queryParams.l ?? "";
        const maxPrice = router.queryParams.h ?? "";

        return <div className="container">
            <Header />
            {this.state.csat && <CSAT id="Category" />}
            <main className="category-page category-page_flex category-page_flex_column">
                {this.state.showNotAuthAlert && <Alert
                    title="Необходимо войти"
                    content="Для добавления товаров в корзину, надо сначала войти в профиль."
                    successButtonTitle="Войти"
                    onSuccess={() => router.navigateTo("/signin")}
                    onClose={() => this.setState({ showNotAuthAlert: false })}
                />}
                <h1 className="category-page__main-h1">{this.state.category.name}</h1>
                <div className="category-page__search">
                    <div className="category-page__search__field tf-button">
                        <TextField
                            className="tf-button__tf"
                            value={searchString}
                            onChange={(ev) => this.setState({ searchString: ev.target.value }, false)}
                            onEnter={(ev: any) => this.handleSearch()}
                        />
                        <Button
                            className="tf-button__btn"
                            iconSrc={SearchIcon}
                            onClick={() => this.handleSearch()}
                        />
                    </div>
                    <Button
                        className="category-page__search__btn success-button"
                        title={this.state.showFilters ? "Убрать фильтры" : "Показать фильтры"}
                        onClick={(ev: any) => {
                            this.setState({ showFilters: !this.state.showFilters });
                            if (!this.state.showFilters) {
                                this.handleSearch();
                            }
                        }}
                    />
                </div>
                {this.state.showFilters && <div className="category-page__filters">
                    <div>
                        <div className="category-page__filters__sort-title">Сортировать:</div>
                        <Select defaultValue={sortType} onSelect={(k) => this.setState({
                            filters: {
                                ...this.state.filters,
                                sortType: k,
                            }
                        }, false)} options={[
                            { key: "default", name: "Не сортировать" },
                            { key: "price_asc", name: "Сначала дешёвые" },
                            { key: "price_desc", name: "Сначала дорогие" },
                            { key: "rating_asc", name: "Сначала менее популярные" },
                            { key: "rating_desc", name: "Сначала популярные" },
                        ]} />
                    </div>

                    <div className="category-page__filters__sep" />

                    <div>
                        <div className="category-page__filters__min-price-title">Цена от</div>
                        <TextField
                            type="number"
                            title="0"
                            className="category-page__filters__min-price"
                            maxLength={7}
                            value={minPrice}
                            onChange={(ev: any) => this.setState({
                                filters: {
                                    ...this.state.filters,
                                    minPrice: ev.target.value,
                                }
                            }, false)}
                        />
                        <div className="category-page__filters__max-price-title">до</div>
                        <TextField
                            type="number"
                            title="&#8734;"
                            className="category-page__filters__max-price"
                            maxLength={7}
                            value={maxPrice}
                            onChange={(ev: any) => this.setState({
                                filters: {
                                    ...this.state.filters,
                                    maxPrice: ev.target.value,
                                }
                            }, false)}
                        />
                    </div>

                    <div className="category-page__filters__sep" />

                    <div>
                        <div className="category-page__filters__rating-title">Рейтинг от</div>
                        <div className="category-page__filters__rating-value">
                            {Array(5).fill(0).map((E, I) =>
                                <img
                                    className={
                                        this.state.filters.starsHover !== 0
                                            && this.state.filters.starsHover <= I
                                            && this.state.filters.minRating > I
                                            ? "review-modal__content__form__rating__value__star removed"
                                            : "review-modal__content__form__rating__value__star"
                                    }
                                    src={(this.state.filters.starsHover > I || this.state.filters.minRating > I) ? StarFilledIcon : StarIcon}
                                    onMouseOver={() => this.setState({
                                        filters: {
                                            ...this.state.filters,
                                            starsHover: I + 1
                                        }
                                    })}
                                    onMouseLeave={() => this.setState({
                                        filters: {
                                            ...this.state.filters,
                                            starsHover: 0
                                        }
                                    })}
                                    onClick={() => this.setState({
                                        filters: {
                                            ...this.state.filters,
                                            minRating: this.state.filters.starsHover
                                        }
                                    })}
                                />
                            )}
                        </div>
                    </div>

                    <Button
                        className="category-page__filters__apply-btn"
                        title={"Применить"}
                        onClick={() => this.handleSearch()}
                    />
                </div>}
                <hr className="category-page__sep" />
                <div className="category-page__cards-container">
                    {
                        this.state.products.map((item) =>
                            <ProductCard
                                id={`${item.id}`}
                                inCart={item.isInCart}
                                price={`${item.price}`}
                                discountPrice={item.discount_price}
                                title={`${item.name}`}
                                rating={`${item.rating}`}
                                reviewsCouxnt={`${item.reviews_count}`}
                                mainImageAlt={`Изображение товара ${item.name}`}
                                mainImageSrc={item.image}
                                onError={(err: any) => {
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
