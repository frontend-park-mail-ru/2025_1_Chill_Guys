import Tarakan from "bazaar-tarakan";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./styles.scss";
import { Nofitication } from "../../api/nofitications";
import Button from "../../components/Button/Button";
import InfinityList from "../../components/InfinityList/InfinityList";

class NotificationsPage extends Tarakan.Component {
    state = {
        notifications: [],
        unread_count: 0,
        readBlock: true,
    };

    init() {
        this.app.store.user.sendAction("getNofitications");
        this.subscribe("user", (name: string, value: any) => {
            if (name === "login") {
                this.app.store.user.sendAction("getNofitications");
            }
            if (name === "nots") {
                this.setState({
                    notifications: value.notifications,
                    unread_count: value.unread_count,
                    readBlock: false,
                });
            }
            if (name === "nof_timer") {
                this.app.store.user.sendAction("getNofitications");
            }
        });
    }

    render() {
        return (
            <div className="nots-page">
                <Header />
                <main className="nots-page__main">
                    <div className="nots-page__main__header">
                        <h1>Уведомления</h1>
                        {this.state.unread_count !== 0 && (
                            <span className="nots-page__main__header__unread">
                                У вас {this.state.unread_count} непрочитанных
                            </span>
                        )}
                    </div>
                    <div className="nots-page__main__notifications">
                        {this.state.notifications.length > 0 ? (
                            this.state.notifications.map(
                                (notification: Nofitication) => (
                                    <div
                                        className={
                                            notification.isRead
                                                ? "nots-page__main__notifications__item"
                                                : "nots-page__main__notifications__item unread"
                                        }
                                    >
                                        <div className="nots-page__main__notifications__item__header">
                                            <h2 className="nots-page__main__notifications__item__header__h">
                                                {notification.title}
                                            </h2>
                                            {!notification.isRead && (
                                                <Button
                                                    variant="text"
                                                    title="Отметить как прочитанное"
                                                    className="nots-page__main__notifications__item__header__viewed"
                                                    onClick={() =>
                                                        this.app.store.user.sendAction(
                                                            "setVisibleNofitication",
                                                            notification.id,
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                        <p className="nots-page__main__notifications__item__value">
                                            {notification.text}
                                        </p>
                                        <div className="nots-page__main__notifications__item__date">
                                            {new Date(
                                                notification.updatedAt,
                                            ).toLocaleString("ru-RU")}
                                        </div>
                                    </div>
                                ),
                            )
                        ) : (
                            <div>У вас пока нет ни одного уведомления</div>
                        )}
                    </div>
                    <InfinityList
                        onShow={() =>
                            !this.state.readBlock &&
                            this.app.store.user.sendAction("nextNofitications")
                        }
                    />
                </main>
                <Footer />
            </div>
        );
    }
}

export default NotificationsPage;
