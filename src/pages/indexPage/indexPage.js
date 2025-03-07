'use strict';

import BasePage from "../basePage.js";
import ProductCard from "../../components/productCard/productCard.js";
import Header from "../../components/header/header.js";
import Footer from "../../components/footer/footer.js";

class IndexPage extends BasePage {
    constructor() {
        super("indexPage/indexPage");
    }

    #elementPerPageCount = 20;

    render(context) {
        return super.renderElement(context, {}, {
            "header": new Header({}),
            "footer": new Footer({}),
            "cards": Array(this.#elementPerPageCount).fill(0).map(
                (element, i) => new ProductCard({
                    mainImageAlt: `Изображение кроссовок nike ari max rainbow`,
                    mainImageSrc: "/src/shared/images/nike.png",
                    price: 2000,
                    oldPrice: 4990,
                    sale: 40,
                    rating: 5.0,
                    reviewsCount: 299,
                    brand: "Nike",
                    title: `Кроссовки Nike Air Max Rainbow`
                })
            ),
        })
    }
}

export default IndexPage;
