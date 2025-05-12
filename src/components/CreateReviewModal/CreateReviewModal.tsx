import Tarakan from "bazaar-tarakan";
import Button from "../Button/Button";

import crossIcon from "../../shared/images/cross-ico.svg";
import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";
import TextArea from "../TextArea/TextArea";

import "./styles.scss";

class CreateReviewModal extends Tarakan.Component {
    state = {
        description: "",
        starsSelected: 0,
        starsHover: 0,
    };

    renderFinished(container: HTMLDivElement) {
        container.style.animation =
            "0.3s review-modal-showing-animation linear";
    }

    render(props) {
        // // console.log(this.state);
        return (
            <div className="review-modal">
                <div className="review-modal__tint" />
                <div className="review-modal__content">
                    <div className="review-modal__content__title">
                        <div className="review-modal__content__title__h">
                            Оставить отзыв
                        </div>
                        <div className="review-modal__content__title__close">
                            <img
                                className="review-modal__content__title__close__img"
                                src={crossIcon}
                                onClick={() => props.onClose()}
                            />
                        </div>
                    </div>
                    <div className="review-modal__content__form">
                        <div className="review-modal__content__form__rating">
                            <div className="review-modal__content__form__rating__title">
                                Рейтинг:
                            </div>
                            <div className="review-modal__content__form__rating__value">
                                {Array(5)
                                    .fill(0)
                                    .map((E, I) => (
                                        <img
                                            className={
                                                this.state.starsHover !== 0 &&
                                                this.state.starsHover <= I &&
                                                this.state.starsSelected > I
                                                    ? "review-modal__content__form__rating__value__star removed"
                                                    : "review-modal__content__form__rating__value__star"
                                            }
                                            src={
                                                this.state.starsHover > I ||
                                                this.state.starsSelected > I
                                                    ? StarFilledIcon
                                                    : StarIcon
                                            }
                                            onMouseOver={() =>
                                                this.setState({
                                                    starsHover: I + 1,
                                                })
                                            }
                                            onMouseLeave={() =>
                                                this.setState({ starsHover: 0 })
                                            }
                                            onClick={() =>
                                                this.setState({
                                                    starsSelected:
                                                        this.state.starsHover,
                                                })
                                            }
                                        />
                                    ))}
                            </div>
                        </div>
                        <TextArea
                            rows={5}
                            type="textarea"
                            className="review-modal__content__form__description"
                            title="Комментарий"
                            onChange={(ev) =>
                                this.setState({ description: ev.target.value })
                            }
                        />
                    </div>
                    <div className="review-modal__content__actions">
                        <Button
                            title="Отправить"
                            variant="primary"
                            onClick={() =>
                                props.onSend &&
                                props.onSend(
                                    this.state.description,
                                    this.state.starsSelected,
                                )
                            }
                            disabled={
                                this.state.description === "" ||
                                this.state.starsSelected === 0
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateReviewModal;
