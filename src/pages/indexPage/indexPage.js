"use strict";

import BasePage from "../basePage.js";
import ProductCard from "../../components/productCard/productCard.js";
import Header from "../../components/header/header.js";
import Footer from "../../components/footer/footer.js";
import ajax from "../../../modules/ajax.js";
import { SERVER_URL } from "../../settings.js";

import indexPageTemplate from "./indexPage.hbs";

class IndexPage extends BasePage {
  constructor() {
    super(indexPageTemplate);
  }

  /**
   * Состояние страницы:
   * - products: массив доступных товаров
   */
  state = {
    products: [],
  };

  /**
   * Инициализация страницы
   */
  initState() {
    this.fetchProducts();
  }

  /**
   * Запрашивает у сервера все доступные товары
   */
  async fetchProducts() {
    const res = await ajax.get("api/products/", { origin: SERVER_URL });

    if (res.result?.status === 200) {
      const data = await res.result.json();
      this.setState({ products: data.products });
    }
  }

  /**
   * Функция генерации главной страницы
   * @returns {HTMLElement}
   */
  render(context) {
      console.log(`SERVER URL: ${SERVER_URL}`)
    return super.renderElement(
      context,
      {},
      {
        header: new Header({}),
        footer: new Footer({}),
        cards: this.state.products.map(
          (product) =>
            new ProductCard({
              mainImageAlt: `Изображение кроссовок nike ari max rainbow`,
              mainImageSrc: `${SERVER_URL}/api/${product.image}`,
              price: product.price,
              rating: product.rating,
              reviewsCount: product.reviews_count,
              title: product.name,
            }),
        ),
      },
    );
  }
}

export default IndexPage;
