import { Store } from "bazaar-tarakan";
import { getProducts } from "../api/product";
import { AJAXErrors } from "../api/errors";
import { getAllCategories } from "../api/categories";

const initValue = {
    products: null,
    categories: null,
};

const initAction = (store: Store) => { }

const ProductsStore = new Store(initValue, initAction);

// Скачивание данных

ProductsStore.addAction("all", async (store: Store) => {
    const { code, products } = await getProducts(0);
    if (code === AJAXErrors.NoError) {
        store.sendAction("productsUpdated", {
            ...store.value,
            products,
        });
        return products;
    }
    return [];
});

ProductsStore.addAction("categoryList", async (store: Store) => {
    const { code, data } = await getAllCategories();
    if (code === AJAXErrors.NoError) {
        const categories = Object.fromEntries(data.categories.map((category) => [category.id, {
            id: category.id,
            name: category.name,
        }]));
        store.sendAction("categoriesUpdated", {
            ...store.value,
            categories,
        });
        return categories;
    }
    return [];
});

// Обработка запросов

ProductsStore.addAction("getCategories", async (store: Store) => {
    if (store.value.categories) {
        return Object.values(store.value.categories);
    } else {
        return Object.values(await store.sendAction("categoryList"));
    }
});

ProductsStore.addAction("getCategory", (store: Store) => {
});

export default ProductsStore;