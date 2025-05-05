import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";
import Select from "../../components/Select/Select";

import SearchIcon from "../../shared/images/search-ico.svg";
import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";

import "./styles.scss";
import { getSearchResultByFilters } from "../../api/product";
import { AJAXErrors } from "../../api/errors";
import ProductCard from "../../components/ProductCard/ProductCard";
import InfinityList from "../../components/InfinityList/InfinityList";


class SearchPage extends Tarakan.Component {
    handleSearch() {
        const request = {
            r: this.state.searchString,
        };
        if (this.state.showFilters) {
            if (this.state.filters.minRating) { request["rt"] = this.state.filters.minRating }
            if (this.state.filters.minPrice) { request["l"] = this.state.filters.minPrice }
            if (this.state.filters.maxPrice) { request["h"] = this.state.filters.maxPrice }
            if (this.state.filters.sortType) { request["s"] = this.state.filters.sortType }
        }
        this.app.navigateTo("/search", request)
        this.fetchSearchResult();
    }

    async fetchSearchResult() {
        if (this.state.fetching) return;
        this.state.fetching = true;
        const { code, data } = await getSearchResultByFilters(
            this.state.searchString,
            0,
            this.state.showFilters
                ? this.state.filters
                : {}
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                categories: data.categories.categories,
                products: data.products.products,
                productsOffset: this.state.productsOffset + data.products.products.length,
                fetching: false,
            });
        } else {
            this.state.fetching = false;
        }
    }

    async fetchNext() {
        if (this.state.fetching) return;
        this.state.fetching = true;
        const { code, data } = await getSearchResultByFilters(
            this.state.searchString,
            this.state.products.length,
            this.state.showFilters
                ? this.state.filters
                : {}
        );
        if (code === AJAXErrors.NoError) {
            this.setState({
                products: [...this.state.products, ...data.products.products],
                fetching: false,
            });
        } else {
            this.state.fetching = false;
        }
    }

    init() {
        this.state = {
            searchString: this.app.queryParams.r ?? this.app.navigateTo("/"),
            showFilters: (this.app.queryParams.s),
            filters: {
                starsHover: 0,
                minRating: this.app.queryParams.rt ?? 0,
                minPrice: this.app.queryParams.l ?? "",
                maxPrice: this.app.queryParams.h ?? "",
                sortType: this.app.queryParams.s ?? "default",
            },
            fetching: false,
            products: [],
            categories: []
        }
        this.fetchSearchResult();
    }

    update() {
        this.state = {
            searchString: this.app.queryParams.r ?? this.app.navigateTo("/"),
            showFilters: (this.app.queryParams.s),
            filters: {
                starsHover: 0,
                minRating: this.app.queryParams.rt ?? 0,
                minPrice: this.app.queryParams.l ?? "",
                maxPrice: this.app.queryParams.h ?? "",
                sortType: this.app.queryParams.s ?? "default",
            },
            products: [],
            categories: []
        }
        this.fetchSearchResult();
    }

    render(props, app) {
        const searchString = app.queryParams.r ?? app.navigateTo("/");

        const sortType = app.queryParams.s ?? "default";
        const minPrice = app.queryParams.l ?? "";
        const maxPrice = app.queryParams.h ?? "";

        let s = new Set();
        for (let e of this.state.products) {
            if (s.has(e.id)) {
                // console.log("HAS", e.id)
            } else {
                // console.log(e.id)
                s.add(e.id);
            }
        }

        return <div className="search-page">
            <Header />
            <main className="search-page__content">
                <div className="search-page__content__search">
                    <div className="search-page__content__search__field tf-button">
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
                        className="search-page__content__search__btn success-button"
                        title={this.state.showFilters ? "Убрать фильтры" : "Показать фильтры"}
                        onClick={(ev: any) => {
                            this.setState({ showFilters: !this.state.showFilters });
                            if (!this.state.showFilters) {
                                this.handleSearch();
                            }
                        }}
                    />
                </div>
                {this.state.showFilters && <div className="search-page__content__filters">
                    <div>
                        <div className="search-page__content__filters__sort-title">Сортировать:</div>
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

                    <div className="search-page__content__filters__sep" />

                    <div>
                        <div className="search-page__content__filters__min-price-title">Цена от</div>
                        <TextField
                            type="number"
                            title="0"
                            className="search-page__content__filters__min-price"
                            maxLength={7}
                            min={0}
                            value={minPrice}
                            onChange={(ev: any) => this.setState({
                                filters: {
                                    ...this.state.filters,
                                    minPrice: ev.target.value,
                                }
                            }, false)}
                        />
                        <div className="search-page__content__filters__max-price-title">до</div>
                        <TextField
                            type="number"
                            title="&#8734;"
                            className="search-page__content__filters__max-price"
                            maxLength={7}
                            value={maxPrice}
                            min={0}
                            onChange={(ev: any) => this.setState({
                                filters: {
                                    ...this.state.filters,
                                    maxPrice: ev.target.value,
                                }
                            }, false)}
                        />
                    </div>

                    <div className="search-page__content__filters__sep" />

                    <div>
                        <div className="search-page__content__filters__rating-title">Рейтинг от</div>
                        <div className="search-page__content__filters__rating-value">
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
                        className="search-page__content__filters__apply-btn"
                        title={"Применить"}
                        onClick={() => this.handleSearch()}
                    />
                </div>}
                <hr className="search-page__content__sep" />
                <div className="search-page__content__categories">
                    <h1 className="search-page__content__categories__h">Найденные категории</h1>
                    {this.state.categories.length > 0 ? <div className="search-page__content__categories__list">
                        {this.state.categories.map((C) =>
                            <Button
                                className="search-page__content__categories__list__item"
                                title={C.name}
                                variant="text"
                                onClick={() => this.app.navigateTo(`/category/${C.id}`)}
                            />
                        )}
                    </div> : "По вашему запросу категории не найдены"}
                </div>
                <hr className="search-page__content__sep" />
                <div className="search-page__content__products">
                    <h1 className="search-page__content__products__h">Найденные товары</h1>
                    {this.state.products.length > 0 ? <div className="search-page__content__products__list">
                        {
                            this.state.products.map(
                                (item) =>
                                    <ProductCard
                                        id={`${item.id}`}
                                        inCart={item.isInCart}
                                        price={`${item.price}`}
                                        discountPrice={item.discount_price}
                                        title={`${item.name}`}
                                        rating={`${item.rating}`}
                                        reviewsCount={`${item.reviews_count}`}
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
                    </div> : "По вашему запросу товары не найдены"}
                    {this.state.products.length > 0 &&
                        <InfinityList onShow={() => this.fetchNext()} />
                    }
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default SearchPage;

/*
<div className="search-page__content__search tf-button">
                    <TextField className="tf-button__tf" value={searchString} onChange={(ev) => app.navigateTo("/search", {
                        r: ev.target.value,
                    })} />
                    <Button className="tf-button__btn" iconSrc={SearchIcon} />
                </div>
*/