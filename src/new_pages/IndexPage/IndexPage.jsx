import Tarakan from "../../../modules/tarakan";
import Header from "../../new_components/Header/Header.jsx";
import Footer from "../../new_components/Footer/Footer.jsx";

class IndexPage extends Tarakan.Component {

    state = {}

    render(props, router) {

        return <div className={`container`}>
            <Header/>

            <main className={`index-page`}>
                <h1 className={`h-reset main-h1`}>Весенние хиты</h1>
                <div className={`cards-container`}>
                    {
                        () => {
                            const response = ajax.get('api/products/');
                            if (response?.result.code === 200) {
                                return <div>hello!</div>
                            } else {
                                return <div>error</div>
                            }
                        }
                    }
                </div>
            </main>

            <Footer/>
         </div>
    }
}

export default IndexPage;