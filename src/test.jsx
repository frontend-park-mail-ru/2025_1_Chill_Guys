import tarakan, { TarakanComponent } from "../modules/tarakan";

import "./styles.scss";

class Main extends TarakanComponent {

    state = {
        count: 0,
    };

    render(props) {
        return <div className="test_page">
            <div className="actions">
                <button
                    className="btn button__variant__primary"
                    onClick={() => {
                        this.setState({ count: this.state.count + 1 });
                    }}
                >
                    Добавить
                </button>
                <button
                    disabled={this.state.count == 0}
                    className="btn button__variant__text"
                    onClick={() => {
                        this.setState({ count: this.state.count - 1 });
                    }}
                >
                    Удалить
                </button>
            </div>
            {Array(this.state.count).fill(0).map((E, I) =>
                <button
                    className="btn button__variant__primary"
                    onClick={() => {
                        alert(I);
                    }}
                >
                    {I}
                </button>
            )}
        </div>
    }
}

export default Main;