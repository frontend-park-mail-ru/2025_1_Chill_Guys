import Tarakan from "../../../modules/tarakan";
import Header from "../../new_components/Header/Header.jsx";

class IndexPage extends Tarakan.Component {
    render(props, router) {
        return <div className={`container`}>
            <Header/>

            <button onClick={() => router.navigateTo("/signin")}>Click</button>
         </div>
    }
}

export default IndexPage;