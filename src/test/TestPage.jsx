import Tarakan from "../../modules/tarakan";
import TestComponent from "./TestComponent.jsx";

import "./styles.scss";

export default class TestPage extends Tarakan.Component {
    render(props) {
        return <div className="page1">
            {
                Array(10).fill(0).map((E, I) => <TestComponent />)
            }
        </div>
    }
}

/*
const root = document.getElementById("root");
root.append(Tarakan.renderDOM(<TestPage />, root))
*/