import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import TextField from "../../components/TextField/TextField";
import Button from "../../components/Button/Button";

import SearchIcon from "../../shared/images/search-ico.svg";

import "./styles.scss";

class SearchPage extends Tarakan.Component {

    handleSearch(searchString) {
        this.app.navigateTo("/search", {
            r: searchString,
        })
    }

    init() {
        this.state = {
            searchString: this.app.queryParams.r ?? this.app.navigateTo("/"),
            showFilters: false,
        }
    }

    render(props, app) {
        const searchString = app.queryParams.r ?? app.navigateTo("/");

        return <div className="search-page">
            <Header />
            <main className="search-page__content">
                <div className="search-page__content__search">
                    <div className="search-page__content__search__field tf-button">
                        <TextField
                            className="tf-button__tf"
                            value={searchString}
                            onChange={(ev) => this.setState({ searchString: ev.target.value }, false)}
                            onEnter={(ev: any) => this.handleSearch(ev.target.value)}
                        />
                        <Button
                            className="tf-button__btn"
                            iconSrc={SearchIcon}
                            onClick={() => this.handleSearch(this.state.searchString)}
                        />
                    </div>
                    <Button
                        className="search-page__content__search__btn success-button"
                        title={this.state.showFilters ? "Убрать фильтры" : "Показать фильтры"}
                        onClick={(ev: any) => this.handleSearch(ev.target.value)}
                    />
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