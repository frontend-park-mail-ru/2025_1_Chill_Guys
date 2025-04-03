import Tarakan from "../../../modules/tarakan";

class IndexPage extends Tarakan.Component {
    render(props, router) {
        return <div>
            <button onClick={() => router.navigateTo("/signin")}>Click</button>
        </div>
    }
}

export default IndexPage;