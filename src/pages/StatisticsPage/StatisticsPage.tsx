import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";
import Button from "../../components/Button/Button";
import StarFilledIcon from "../../shared/images/star-filled-ico.svg";
import { getAllSurveys, getStats } from "../../api/csat";
import { AJAXErrors } from "../../api/errors";

class StatisticsPage extends Tarakan.Component {
    state = {
        surveys: null,
        selectedSurver: null,
        selectedQuestion: 0,
    }

    async fetchSurveys() {
        const { code, surveys } = await getAllSurveys();
        if (code === AJAXErrors.NoError) {
            this.setState({
                surveys: surveys
            });
            if (surveys.length > 0) {
                this.fetchSurvey(surveys[0]);
            }
        } else {
            this.app.navigateTo("/");
        }
    }

    async fetchSurvey(survey) {
        const { code, data } = await getStats(survey.id);
        if (code === AJAXErrors.NoError) {
            this.setState({
                selectedSurver: {
                    name: survey.title,
                    description: data.description,
                    questions: data.questions.map((E) => {
                        const sm = E.stats.reduce((partialSum, a) => partialSum + a, 0);
                        let summ = 0;
                        let count = 0;
                        E.stats.forEach((E2, I) => {
                            summ += E2 * I;
                            count += I === 0 ? 0 : E2;
                        })
                        return {
                            text: E.text,
                            stats: E.stats.map((stat: any) => sm === 0 ? 0 : stat / sm * 100),
                            rating: count === 0 ? 0 : summ / count,
                        };
                    })
                },
                selectedQuestion: 0,
            })
        }
    }

    init() {
        this.fetchSurveys();
    }

    render() {
        return <div className="stats-page">
            <Header />
            <main className="stats-page__main">
                <h1 class="stats-page__main__h">Статистика</h1>
                <div className="stats-page__main__result">
                    <div className="stats-page__main__result__list">
                        {/* <div className="stats-page__main__result__list__h">Доступные формы:</div> */}
                        <div className="stats-page__main__result__list__items">
                            {this.state.surveys?.map((survey) =>
                                <Button
                                    title={survey.title}
                                    className="stats-page__main__result__list__items__item"
                                    variant="text"
                                    onClick={() => this.fetchSurvey(survey)}
                                />
                            )}
                        </div>
                    </div>
                    {this.state.selectedSurver && <div className="stats-page__main__result__survey">
                        <h2 className="stats-page__main__result__survey__h">{this.state.selectedSurver.name}</h2>
                        <div className="stats-page__main__result__survey__description">
                            {this.state.selectedSurver.description}
                        </div>
                        <hr />
                        <div className="stats-page__main__result__survey__questions">
                            <span className="stats-page__main__result__survey__questions__t">Вопросы:</span>
                            <span className="stats-page__main__result__survey__questions__actions">
                                {Array(this.state.selectedSurver.questions.length).fill(0).map((E, I) =>
                                    <Button
                                        className={
                                            this.state.selectedQuestion !== I
                                                ? "stats-page__main__result__survey__questions__actions__b"
                                                : "stats-page__main__result__survey__questions__actions__b-selected"
                                        }
                                        size="s"
                                        title={I + 1}
                                        onClick={() => this.setState({ selectedQuestion: I })}
                                    />
                                )}
                            </span>
                        </div>
                        <hr />
                        <div className="stats-page__main__result__survey__question">
                            <span className="stats-page__main__result__survey__question__t">Вопрос:</span>
                            <span className="stats-page__main__result__survey__question__actions">
                                {this.state.selectedSurver.questions[this.state.selectedQuestion].text}
                            </span>
                        </div>
                        <div className="stats-page__main__result__survey__question-result">
                            <div className="stats-page__main__result__survey__question-result__t">Результаты:</div>
                            <div className="stats-page__main__result__survey__question-result__value">
                                {Array(10).fill(0).map((E, I) =>
                                    <div className="stats-page__main__result__survey__question-result__value__c">
                                        <div className="stars">
                                            {Array(I + 1).fill(0).map((E, I) =>
                                                <img
                                                    className="star"
                                                    src={StarFilledIcon}
                                                />
                                            )}
                                        </div>
                                        <div className="stats-page__main__result__survey__question-result__value__c__res">
                                            {parseInt(this.state.selectedSurver.questions[this.state.selectedQuestion].stats[I + 1])} %
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="stats-page__main__result__survey__question-result__s">
                                Количество пропусков данного вопроса - {this.state.selectedSurver.questions[this.state.selectedQuestion].stats[0]}
                            </div>
                            <div className="stats-page__main__result__survey__question-result__r">Средний рейтинг - {this.state.selectedSurver.questions[this.state.selectedQuestion].rating.toFixed(2)}</div>
                        </div>
                    </div>}
                </div>
            </main>
            <Footer />
        </div>
    }
}

export default StatisticsPage;