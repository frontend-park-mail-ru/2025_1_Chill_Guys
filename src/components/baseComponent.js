class BaseComponent {
    children = []

    constructor(templateName) {
        this.templateName = templateName
    }

    /**
     * Рендерит элемент по шаблону и добавляет в него необходимые компоненты
     * @param {object} context Параметры для render
     * @param {object} props Параметры, которые будут переданы в шаблон
     * @param {{ componentId: BaseComponent | [BaseComponent] }} components Компоненты, которые будут использованы в шаблоне
     * @returns HTMLElement
     */
    renderElement(context, props, components) {
        this.children = components;

        // Генерируем шаблон с props
        const template = Handlebars.templates[this.templateName];
        const parser = new DOMParser();
        const element = parser.parseFromString(template(props), 'text/html').body.firstChild;

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
                        parent: element
                    });
                    elements.push(child);
                });
            } else {
                const child = components[K].render({ id: K, parent: element });
            }
        });

        // Если не установлен флаг root, то ставим себя на нужное место в родителе
        if (!context.root) {
            const componentElement = context.parent.querySelector(`component[data-id="${context.id}"]`);

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

        return element;
    }
}

export default BaseComponent