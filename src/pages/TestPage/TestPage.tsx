import Tarakan from "bazaar-tarakan";
import RightInfinityList from "../../components/RightInfinityList/RightInfinityList";

class TestPage extends Tarakan.Component {
    async load() {
        return [{}];
    }

    render() {
        return (
            <RightInfinityList
                elementMinWidth={280}
                offsetRow={16}
                offsetCol={16}
                onLoad={async () => this.load()}
                builder={() => <div className="wtf_1">Hello</div>}
            />
        );
    }
}

export default TestPage;
