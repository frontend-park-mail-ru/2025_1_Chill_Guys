function compareObjects(object1, object2) {
    let keysCount = 0;
    for (const key of Object.keys(object1)) {
        keysCount += 1;
        if (object1[key] != object2[key] && typeof (object1[key]) != 'function') {
            return false;
        }
    }
    return keysCount == Object.keys(object2).length;
}

class BaseComponent {
    /**
     * Хранит информация о прошлом render компоненты:
     * - props: параметры компоненты
     * - components: дочерние компоненты данной компоненты
     * - element: HTMLElement данной компоненты
     * - children: словарь HTMLElement каждой дочерней компоненты
     */
    #lastRender = null;

    /**
     * Хранит словарь дочерних компонент
     */
    children = {};

    /**
     * Флаг того, изменился ли элемент после renderElement
     */
    elementChanged = true;

    /**
     * Состояние компоненты
     */
    state = {};

    /**
     * Функция перехода между страницами
     */
    showPage = null;

    constructor(templateName) {
        this.templateName = templateName;
    }

    /**
     * Вызывается автоматически при генерации компоненты после создания всех её детей
     */
    initState() { }

    /**
     * Возвращает результат генерации данной компоненты
     * @returns {HTMLElement}
     */
    getElement() {
        return this.#lastRender?.element;
    }

    /**
     * Принуждает компоненту заново сгененировать себя
     */
    resetElement() {
        this.#lastRender = null;
    }

    /**
     * Рендерит элемент по шаблону и добавляет в него необходимые компоненты
     * @param {object} context Параметры для render
     * @param {object} props Параметры, которые будут переданы в шаблон
     * @param {{ componentId: BaseComponent | [BaseComponent] }} components Компоненты, которые будут использованы в шаблоне
     * @returns HTMLElement
     */
    renderElement(context, props, components) {
        if (this.#lastRender && !context.root) {
            return this.updateElement(props, components);
        }

        this.showPage = context.showPage;
        this.children = components;

        // Генерируем шаблон с props
        const template = Handlebars.templates[this.templateName];
        const parser = new DOMParser();
        const element = parser.parseFromString(template(props), 'text/html').body.firstChild;

        const newChildren = {};

        // Вызываем render у детей
        Object.keys(components).map((K) => {
            // Если ребёнок - массив компонент
            if (Array.isArray(components[K])) {
                const elements = [];
                components[K].forEach((E, I) => {
                    const child = E.render({
                        id: K,
                        index: I,
                        lastChild: I == components[K].length - 1,
                        parent: element,
                        showPage: context.showPage,
                    });
                    elements.push(child);
                });
                newChildren[K] = elements;
            } else {
                const child = components[K].render({ id: K, parent: element, showPage: context.showPage });
                newChildren[K] = child;
            }
        });

        // Если не установлен флаг root, то ставим себя на нужное место в родителе
        if (!context.root) {
            const componentElement = context.place ?? context.parent.querySelector(`component[data-id="${context.id}"]`);

            if (componentElement == null) {
                console.log("Template error:", "No", context.id, "component!");
                console.log("Template:");
                console.log(context.parent.outerHTML);
                return element;
            }

            // Если задан index, то ставим себя перед элементом <component> c id: [component_id]_[index]
            if (context.index !== undefined) {
                // element.dataset['id'] = `${context.id}_${context.index}`;
                componentElement.before(element);

                // Если это последний элемент в списке, то удаляем componentElement
                if (context.lastChild) {
                    componentElement.remove();
                }
            } else {
                // element.dataset['id'] = context.id;
                componentElement.replaceWith(element);
            }
        }

        this.#lastRender = {
            props,
            components,
            element,
            children: newChildren
        }
        this.initState();

        return element;
    }

    /**
     * Функция обновления компоненты:
     * - Если обновились props, то заново создаётся элемент из шаблона и заполняется компонентами
     * - Если обновились компоненты, то заменяются только те, которые были изменены. 
     *   Изменение компоненты проверяется, сравнивая getProps сейчас и при последней генерации.
     * @param {*} props 
     * @param {*} components 
     * @returns {HTMLElement}
     */
    updateElement(props, components) {
        const lastProps = this.#lastRender.props;
        const lastComponents = this.#lastRender.components;
        const lastChildren = this.#lastRender.children;
        const myElement = this.#lastRender.element;
        const newComponents = {};

        let newElement = myElement;

        // Словарь детей после обновления (их HTMLElement)
        let newChildren = {};

        // Изменились ли props
        const propsChanged = !compareObjects(props, lastProps);
        this.elementChanged = propsChanged;

        // Если изменились props, то перегенерируем страницу
        if (propsChanged) {
            const template = Handlebars.templates[this.templateName];
            const parser = new DOMParser();
            newElement = parser.parseFromString(template(props), 'text/html').body.firstChild;
            myElement.replaceWith(newElement);
        }

        Object.keys(components).forEach((key) => {
            if (Array.isArray(components[key])) {
                const lastGroup = lastComponents[key];
                const lastGroupChildren = lastChildren[key];
                const nowGroup = components[key];
                const newGroupChildren = [];
                const newComponentsGroup = [];

                // Выставляется true, когда найдётся первый элемент, который изменится
                let elementsChanged = false;
                for (let i = 0; i < nowGroup.length; i += 1) {
                    if (lastGroup.length > i) {
                        // Элемент обновился
                        if (!compareObjects(nowGroup[i].getProps(), lastGroup[i].getProps())) {
                            elementsChanged = true;
                        }

                        if (elementsChanged) {
                            // Заменяем элемент или ставим его на нужное место
                            newGroupChildren.push(nowGroup[i].render({
                                id: key,
                                parent: myElement,
                                place: !propsChanged ? lastGroupChildren[i] : undefined,
                                index: propsChanged ? i : undefined,
                                showPage: this.showPage,
                            }));
                            newComponentsGroup.push(nowGroup[i]);
                        } else {
                            // Элемент не изменился
                            if (propsChanged) {
                                const componentElement = newElement.querySelector(`component[data-id="${key}"]`);
                                componentElement.replaceWith(lastGroupChildren[i]);
                            }
                            newGroupChildren.push(lastGroupChildren[i]);
                            newComponentsGroup.push(lastGroup[i]);
                        }
                    } else {
                        // Добавляем component для указания места следующей вставки
                        if (lastGroup.length == i && !propsChanged && lastGroup.length != 0) {
                            const iterComponent = document.createElement("component");
                            iterComponent.dataset.id = key;
                            lastGroupChildren[lastGroupChildren.length - 1].after(iterComponent);
                        }

                        // Вставляем новый элемент
                        newGroupChildren.push(nowGroup[i].render({
                            id: key,
                            parent: myElement,
                            index: i,
                            lastChild: i == nowGroup.length - 1,
                            showPage: this.showPage,
                        }));
                        newComponentsGroup.push(nowGroup[i]);
                    }
                }

                // Если количество элементов уменьшилось - удаляем оставшиеся элементы
                if (lastGroup.length > nowGroup.length) {
                    for (let i = nowGroup.length; i < lastGroup.length; i += 1) {
                        // Если в результате остаётся 0 элементов - добавляем component для указания места компоненты
                        if (i == 0) {
                            const iterComponent = document.createElement("component");
                            iterComponent.dataset.id = key;
                            lastGroupChildren[0].replaceWith(iterComponent);
                        } else {
                            lastGroupChildren[i].remove();
                        }
                    }
                }

                newComponents[key] = newComponentsGroup;

                newChildren[key] = newGroupChildren;
                delete lastComponents[key];

                return;
            }

            if (lastComponents[key] !== undefined) {
                if (!compareObjects(lastComponents[key].getProps(), components[key].getProps())) {
                    // Компонента изменилась => перерисовываем
                    console.log("Component", key, "updated!");
                    newChildren[key] = components[key].render({
                        id: key,
                        parent: myElement,
                        place: !propsChanged ? lastChildren[key] : undefined,
                        showPage: this.showPage,
                    });
                    newComponents[key] = components[key];
                } else if (propsChanged) {
                    // Компонента не изменилась, но общий шаблон изменился => вставляем старую на место component
                    const componentElement = newElement.querySelector(`component[data-id="${key}"]`);
                    componentElement.replaceWith(lastChildren[key]);
                    newChildren[key] = lastChildren[key];
                    newComponents[key] = lastComponents[key];
                } else {
                    newChildren[key] = lastChildren[key];
                    newComponents[key] = lastComponents[key];
                }
                delete lastComponents[key];
            } else {
                // Компоненты раньше не было => рендерим её на нужном месте
                newChildren[key] = components[key].render({
                    id: key,
                    parent: myElement,
                    showPage: this.showPage,
                });
                newComponents[key] = components[key];
            }
        });

        // Элементы, которые не нужны
        Object.keys(lastComponents).forEach((key) => {
            console.log("Component", key, "removed!");
            const componentElement = document.createElement("component");
            componentElement.dataset.id = key;
            lastChildren[key].replaceWith(componentElement);
        });

        this.#lastRender = {
            props,
            components: newComponents,
            children: newChildren,
            element: newElement,
        }

        this.children = newComponents;

        return newElement;
    }

    /**
     * Функция изменения состояния компоненты. Принимает словарь новых состояний. Если состояние изменилось, то вызывается render.
     * @param {object} newState Словарь новых состояний.
     */
    setState(newState) {
        let needRender = false;
        for (const key of Object.keys(newState)) {
            // Проверяем, изменилось ли состояние
            if (this.state[key] != newState[key]) {
                needRender = true;
                this.state[key] = newState[key];
            }
        }
        if (needRender) {
            // Вызываем render у компоненты
            this.render({});
        }
    }

    /**
     * Возравщает props компоненты
     * @returns {object}
     */
    getProps() {
        return {};
    }
}

export default BaseComponent