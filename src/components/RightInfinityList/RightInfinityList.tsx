import Tarakan from "bazaar-tarakan";
import "./styles.scss";

function calculateColumns(
    parent: HTMLDivElement,
    minmax: number,
    rowGap: number,
    columnGap: number,
) {
    const width = parent.clientWidth;
    return parseInt((width + columnGap) / (minmax + columnGap) + "");
}

async function fill(
    n,
    container,
    func,
    minmax: number,
    rowGap: number,
    columnGap: number,
) {
    if (minmax === -1) return 1;
    const rect = container.getBoundingClientRect();
    const cols = calculateColumns(container, minmax, rowGap, columnGap);
    if (rect.bottom - window.innerHeight < 0) {
        const colsFill = cols === 0 ? 3 : cols - (n % cols);
        if ((await func(colsFill)) !== 0) {
            setTimeout(() =>
                fill(n + colsFill, container, func, minmax, rowGap, columnGap),
            );
        }
    }
}

class RightInfinityList extends Tarakan.Component {
    state = {
        items: [],
        startIndex: 0,
        endIndex: 0,
        finished: false,
        blocked: false,
    };

    statelessProps = ["builder"];

    async handleScroll(container: HTMLDivElement) {
        const rect = container.getBoundingClientRect();
        const heightOffset = rect.top;
        const firstChild: any = container.firstChild;

        if (!firstChild) return;

        const height = firstChild.clientHeight + this.props.offsetRow;
        const cols = calculateColumns(
            container,
            this.props.elementMinWidth,
            this.props.offsetRow,
            this.props.offsetCol,
        );
        const realCols = this.state.endIndex - this.state.startIndex;

        if (-heightOffset > height) {
            this.clearPrevious(cols - (realCols > cols ? 0 : realCols % cols));
            container.style.marginTop =
                (parseInt(container.style.marginTop) || 0) + height + "px";
        } else if (
            heightOffset >= this.props.offsetRow / 2 &&
            this.state.startIndex > 0
        ) {
            this.renderPrevious(cols - (realCols > cols ? 0 : realCols % cols));
            container.style.marginTop =
                (parseInt(container.style.marginTop) || 0) - height + "px";
        } else if (
            rect.bottom - window.innerHeight <= 0 &&
            !this.state.blocked
        ) {
            await this.renderNext(cols - (realCols % cols));
            container.style.marginBottom =
                Math.max(
                    0,
                    (parseInt(container.style.marginBottom) || 0) - height,
                ) + "px";
        } else if (rect.bottom - window.innerHeight > height) {
            this.clearNext(
                this.state.endIndex != this.state.items.length
                    ? cols
                    : this.state.items.length % cols,
            );
            container.style.marginBottom =
                (parseInt(container.style.marginBottom) || 0) + height + "px";
        }
    }

    renderFinished(container: HTMLDivElement): void {
        document.addEventListener("scroll", () => this.handleScroll(container));
        window.addEventListener("resize", () => this.handleScroll(container));
        fill(
            0,
            container,
            (n) => this.renderNext(n),
            this.props.elementMinWidth,
            this.props.offsetRow,
            this.props.offsetCol,
        );
    }

    clearPrevious(count) {
        this.setState({
            startIndex: this.state.startIndex + count,
        });
    }

    renderPrevious(count) {
        this.setState({
            startIndex: this.state.startIndex - count,
        });
    }

    clearNext(count) {
        this.setState({
            endIndex: this.state.endIndex - count,
            finished: false,
        });
    }

    async renderNext(count) {
        if (this.state.finished || this.state.blocked) return;
        this.state.blocked = true;
        const addCount = count;
        count -= this.state.items.length - this.state.endIndex;
        if (count > 0) {
            const items = [];
            while (count > 0) {
                const newItems = await this.props.onLoad(
                    this.state.items.length + items.length,
                );
                if (newItems.length === 0) {
                    break;
                }
                items.push(...newItems);
                count = Math.max(count - newItems.length, 0);
            }
            this.setState({
                items: [...this.state.items, ...items],
                endIndex:
                    count > 0
                        ? this.state.items.length + items.length
                        : this.state.endIndex + addCount,
                finished: count > 0,
                blocked: false,
            });
            return Math.min(items.length, addCount);
        }
        this.setState({
            endIndex: this.state.endIndex + addCount,
            blocked: false,
        });
        return addCount;
    }

    render() {
        return (
            <div className={`infinity-list ${this.props.className}`.trim()}>
                {this.state.items
                    .slice(this.state.startIndex, this.state.endIndex)
                    .map((e, I) =>
                        this.props.builder(e, I + this.state.startIndex),
                    )}
            </div>
        );
    }
}

export default RightInfinityList;
