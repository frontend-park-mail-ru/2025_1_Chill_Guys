import Tarakan from "bazaar-tarakan";
import "./styles.scss";
import Button from "../../components/Button/Button";

import StarIcon from "../../shared/images/star-ico.svg";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";
import { getSurvey, sendSurvey } from "../../api/csat";
import { AJAXErrors } from "../../api/errors";

class SurveyPage extends Tarakan.Component {
    state = {
        title: "",
        surveyId: "",
        questionCount: 10,
        questionIndex: 0,
        starCountHover: 0,
        starCountSelected: 0,
        description: "Супер улётный опрос",
        questions: [],
        answers: [],
        surveyPhase: 0,
    }

    async getSurvey() {
        console.log(this.app.urlParams);
        if (this.app.urlParams.id) {
            const { code, survey } = await getSurvey(this.app.urlParams.id);
            if (code === AJAXErrors.NoError) {
                this.setState({
                    surveyId: survey.surveyId,
                    description: survey.description,
                    questions: survey.questions,
                    title: survey.title,
                    questionCount: survey.questions.length,
                });
            }
        }
    }

    nextQuestion() {
        this.setState({
            questionIndex: this.state.questionIndex + 1,
            starCountHover: 0,
            starCountSelected: 0,
            answers: [...this.state.answers, {
                questionId: this.state.questions[this.state.questionIndex].questionId,
                value: this.state.starCountSelected,
            }]
        });
    }

    skipQuestion() {
        this.setState({
            questionIndex: this.state.questionIndex + 1,
            starCountHover: 0,
            starCountSelected: 0,
            answers: [...this.state.answers, {
                questionId: this.state.questions[this.state.questionIndex].id,
                value: 0,
            }]
        });
    }

    async sendSurvey(f) {
        const code = await sendSurvey(this.state.surveyId, [...this.state.answers, {
            questionId: this.state.questions[this.state.questionIndex].questionId,
            value: f ? 0 : this.state.starCountSelected,
        }]);
        if (code === AJAXErrors.NoError) {
            this.setState({
                surveyPhase: 2
            });
        }
    }

    init() {
        this.getSurvey();
    }

    render() {
        return <div className="survey">
            <div className="survey__title">
                <div className="survey__title__name">
                    <div className="survey__title__name__h">
                        {this.state.title}
                    </div>
                    <div className="survey__title__name__counter">
                        {
                            [
                                "",
                                `Вопрос ${this.state.questionIndex + 1} из ${this.state.questionCount}`,
                                "Пройден"
                            ][this.state.surveyPhase]
                        }
                    </div>
                </div>
                <div className="survey__title__line">
                    {this.state.surveyPhase !== 0 && <div
                        className="survey__title__line__progress"
                        style={`width: ${(this.state.questionIndex + 1) / this.state.questionCount * 100}%`} />
                    }
                </div>
            </div>
            <div className="survey__content">
                <div className="survey__content__question">
                    {
                        [
                            this.state.description,
                            this.state.questions[this.state.questionIndex]?.text,
                            "Спасибо за прохождение опроса. Нам важен каждый отзыв."
                        ][this.state.surveyPhase]
                    }
                </div>
                {this.state.surveyPhase === 1 && <div className="survey__content__answer">
                    {
                        Array(10).fill(0).map((E, I) =>
                            <img
                                className={
                                    this.state.starCountHover !== 0 && this.state.starCountHover <= I && this.state.starCountSelected > I
                                        ? "survey__content__answer__star removed"
                                        : "survey__content__answer__star"
                                }
                                src={(this.state.starCountHover > I || this.state.starCountSelected > I) ? StarFilledIcon : StarIcon}
                                onMouseOver={() => this.setState({ starCountHover: I + 1 })}
                                onMouseLeave={() => this.setState({ starCountHover: 0 })}
                                onClick={() => this.setState({ starCountSelected: this.state.starCountHover })}
                            />
                        )
                    }
                </div>}
            </div>
            <div className="survey__actions">
                {this.state.surveyPhase === 1 && <Button
                    className="survey__actions__skip"
                    variant="text"
                    title="Пропустить вопрос"
                    onClick={() => {
                        if (this.state.questionIndex !== this.state.questionCount - 1) {
                            this.skipQuestion();
                        } else {
                            this.sendSurvey(true);
                        }
                    }}
                />}
                {
                    this.state.surveyPhase === 1
                        ? <Button
                            className="survey__actions__next"
                            variant="primary"
                            title={this.state.questionIndex !== this.state.questionCount - 1 ? "Следующий вопрос" : "Отправить"}
                            disabled={this.state.starCountSelected === 0}
                            onClick={() => {
                                if (this.state.questionIndex !== this.state.questionCount - 1) {
                                    this.nextQuestion();
                                } else {
                                    this.sendSurvey(false);
                                }
                            }}
                        />
                        : <Button
                            className="survey__actions__next"
                            variant="primary"
                            title={this.state.surveyPhase === 0 ? "Поехали" : "Закрыть"}
                            onClick={() => {
                                if (this.state.surveyPhase === 0) {
                                    this.setState({ surveyPhase: 1 });
                                } else {
                                    window.parent.postMessage("finish");
                                }
                            }}
                        />
                }
            </div>
        </div>
    }
}

export default SurveyPage;