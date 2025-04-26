import Tarakan from "bazaar-tarakan";

class SearchPage extends Tarakan.Component {
    render(props, app) {
        return <div>Результаты поиска по запросу "{app.queryParams.r}"</div>
    }
}

export default SearchPage;