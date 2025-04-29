import Tarakan from "bazaar-tarakan";

import ArrowDown from "../../shared/images/arrow-down-ico.svg";

import "./styles.scss";
import Button from "../Button/Button";

class Select extends Tarakan.Component {
    init(initProps) {
        this.state = {
            opened: false,
            selected: initProps.defaultValue ? initProps.options.filter((E) => E.key === initProps.defaultValue)[0] : null,
        }
    }

    render(props) {
        return <div className="select">
            <div className="select__value" onClick={() => this.setState({ opened: !this.state.opened })}>
                <div className="select__value__text">{this.state.selected?.name ?? "Не выбрано"}</div>
                <Button className="select__value__btn" iconSrc={ArrowDown} />
            </div>
            <div className={`select__options${this.state.opened ? " opened" : ""}`}>
                {
                    props.options.map((option) =>
                        <div className="select__options__option" onClick={() => {
                            this.setState({ selected: option, opened: false });
                            if (props.onSelect) props.onSelect(option.key);
                        }}>
                            {option.name}
                        </div>
                    )
                }
            </div>
        </div>
    }
}

export default Select;