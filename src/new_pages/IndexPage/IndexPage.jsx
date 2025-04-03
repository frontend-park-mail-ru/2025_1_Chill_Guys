import Tarakan from "../../../modules/tarakan";
import Header from "../../new_components/Header/Header.jsx";

class IndexPage extends Tarakan.Component {
    render(props, router) {
        return <div>
            <Header/>

            <button onClick={() => router.navigateTo("/reg")}>Click</button>
         </div>
    }
}

export default IndexPage;