import Tarakan from "../../../modules/tarakan";
import Button from "../../new_components/Button/Button.jsx";
import { SERVER_URL } from "../../settings";
import "./styles.scss";

class CartPage extends Tarakan.Component {

    state = {
        items: [
            {
                "id": 1,
                "name": "Смартфон Xiaomi Redmi Note 10",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 19999,
                "oldPrice": 40000,
                "reviews_count": 120,
                "rating": 4.5
            },
            {
                "id": 2,
                "name": "Ноутбук ASUS VivoBook 15",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 54999,
                "oldPrice": 40000,
                "reviews_count": 80,
                "rating": 4.7
            },
            {
                "id": 3,
                "name": "Наушники Sony WH-1000XM4",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 29999,
                "oldPrice": 40000,
                "reviews_count": 200,
                "rating": 4.8
            },
            {
                "id": 4,
                "name": "Фитнес-браслет Xiaomi Mi Band 6",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 3999,
                "oldPrice": 40000,
                "reviews_count": 300,
                "rating": 4.6
            },
            {
                "id": 5,
                "name": "Пылесос Dyson V11",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 59999,
                "oldPrice": 40000,
                "reviews_count": 90,
                "rating": 4.9
            },
            {
                "id": 6,
                "name": "Кофемашина DeLonghi Magnifica",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 79999,
                "oldPrice": 40000,
                "reviews_count": 70,
                "rating": 4.7
            },
            {
                "id": 7,
                "name": "Электросамокат Xiaomi Mi Scooter 3",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 29999,
                "oldPrice": 40000,
                "reviews_count": 150,
                "rating": 4.5
            },
            {
                "id": 8,
                "name": "Умная колонка Яндекс.Станция Мини",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 7999,
                "oldPrice": 40000,
                "reviews_count": 250,
                "rating": 4.4
            },
            {
                "id": 9,
                "name": "Монитор Samsung Odyssey G5",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 34999,
                "oldPrice": 40000,
                "reviews_count": 100,
                "rating": 4.6
            },
            {
                "id": 10,
                "name": "Электрочайник Bosch TWK 3A011",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 1999,
                "oldPrice": 40000,
                "reviews_count": 180,
                "rating": 4.3
            },
            {
                "id": 11,
                "name": "Робот-пылесос iRobot Roomba 981",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 69999,
                "oldPrice": 40000,
                "reviews_count": 60,
                "rating": 4.8
            },
            {
                "id": 12,
                "name": "Фен Dyson Supersonic",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 49999,
                "oldPrice": 40000,
                "reviews_count": 130,
                "rating": 4.7
            },
            {
                "id": 13,
                "name": "Микроволновая печь LG MS-2042DB",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 8999,
                "oldPrice": 40000,
                "reviews_count": 110,
                "rating": 4.2
            },
            {
                "id": 14,
                "name": "Игровая консоль PlayStation 5",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 79999,
                "oldPrice": 40000,
                "reviews_count": 300,
                "rating": 4.9
            },
            {
                "id": 15,
                "name": "Электронная книга PocketBook 740",
                "image": "products/550e8400-e29b-41d4-a716-446655440001/cover",
                "price": 19999,
                "oldPrice": 40000,
                "reviews_count": 90,
                "rating": 4.4
            }
        ]
    }

    render(props) {
        return <div className="cart-page">
            <header />
            <main>
                <h1>Моя корзина</h1>
                <div className="content">
                    <div className="list">
                        {this.state.items.map((item) =>
                            <article className="item">
                                <img className="cover" src={`${SERVER_URL}/api/${item.image}`} />
                                <div className="description">
                                    <div className="title">
                                        <div className="name">{item.name}</div>
                                        <div className="brend">BAZAAR</div>
                                        <div className="price">
                                            <span className="now">{item.price} ₽</span>
                                            <span className="old">{item.oldPrice} ₽</span>
                                            <span className="discount">{-parseInt((item.oldPrice - item.price) / item.oldPrice * 100)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="actions">

                                </div>
                            </article>
                        )}
                    </div>
                    <div className="total">
                        <Button className="make-order" title="Оформление заказа" />
                        <div className="comment">
                            Способы оплаты и доставки будут доступны на следующем шаге
                        </div>
                    </div>
                </div>
            </main>
            <footer />
        </div>
    }
}

export default CartPage;