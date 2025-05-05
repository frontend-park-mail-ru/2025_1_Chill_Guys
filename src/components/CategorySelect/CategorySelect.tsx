import Tarakan from "bazaar-tarakan";
import "./styles.scss";
import { getAllCategories, getSubCategories } from "../../api/categories";
import { AJAXErrors } from "../../api/errors";

class CategorySelect extends Tarakan.Component {
    state = {
        content: "Категория товара не выбрана",
        categories: [],
        selectCategory: null,
        subcategories: [],
        opened: false,
    }

    async fetchCategories() {
        const { code, data } = await getAllCategories();
        if (code === AJAXErrors.NoError) {
            this.setState({ categories: data.categories });
        }
    }

    async fetchSubCategories(category: any) {
        const data = await this.app.store.products.sendAction("getSubCategories", category.id);
        this.setState({ subcategories: data, selectCategory: category });
    }

    init() {
        this.fetchCategories();
    }

    render(props) {
        return <div className={`category-select ${props.className ?? ""}`.trim()}>
            <div className="category-select__text" onClick={() => this.setState({ opened: !this.state.opened })}>
                {this.state.content}
            </div>
            {this.state.opened && <div className="category-select__popup">
                <div className="category-select__popup__categories">
                    {
                        this.state.categories.map((category) =>
                            <div
                                className="category-select__popup__categories__item"
                                onMouseOver={() => this.fetchSubCategories(category)}
                            >
                                {category.name}
                            </div>
                        )
                    }
                </div>
                <div className="category-select__popup__subcategories">
                    {
                        this.state.subcategories.map((subcategory) =>
                            <div
                                className="category-select__popup__subcategories__item"
                                onClick={() => {
                                    this.setState({
                                        content: `${this.state.selectCategory.name} - ${subcategory.name}`,
                                        opened: false,
                                    });
                                    props.onSelect(subcategory.id);
                                }}
                            >
                                {subcategory.name}
                            </div>
                        )
                    }
                </div>
            </div>}
        </div>
    }
}

export default CategorySelect;