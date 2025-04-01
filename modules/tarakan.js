const PROPS_NAMES = {
    "onClick": "onclick",
    "onChange": "oninput"
}

function isScalar(d) {
    return typeof (d) === "string" || typeof (d) === "number";
}

function replaceWith(oldElement, newElement) {
    if (!oldElement || !newElement) {
        return;
    }

    if (Array.isArray(oldElement)) {
        oldElement.at(-1).replaceWith(newElement);
    } else {
        if (Array.isArray(newElement)) {
            element.replaceWith(...newElement);
        } else {
            element.replaceWith(newElement);
        }
    }
}

function appendChild(parent, child) {
    if (Array.isArray(child)) {
        parent.append(...child);
    } else {
        parent.appendChild(child);
    }
}

function disposeDOM(vDOM, removeDOM) {
    if (Array.isArray(vDOM)) {
        vDOM.forEach((child) => {
            disposeDOM(child, removeDOM);
        });
    } else if (vDOM.statefull) {
        if (vDOM.children) disposeDOM(vDOM.children, removeDOM);
        vDOM.component.disposeDOM();
    } else {
        if (vDOM.children) disposeDOM(vDOM.children);
        if (removeDOM) {
            vDOM.dom.remove();
        }
    }
}

function renderDOM(vDOM, parent, props) {
    if (vDOM.statefull) {
        vDOM.component = new vDOM.t();
        vDOM.children = vDOM.component.renderDOM(vDOM, vDOM.props, props);
        vDOM.dom = renderDOM(vDOM.children, parent, props);
        vDOM.parent = parent;
        return vDOM.dom;
    }

    if (Array.isArray(vDOM)) {
        const elements = [];
        vDOM.forEach((element) => {
            const newElements = renderDOM(element, parent, props);
            if (Array.isArray(newElements)) {
                elements.push(...newElements);
            } else {
                elements.push(newElements);
            }
        });
        return elements;
    }

    if (vDOM.isScalar) {
        const node = document.createTextNode(vDOM.props.data);
        vDOM.parent = parent;
        vDOM.dom = node;
        return node;
    }

    const element = document.createElement(vDOM.t);

    if (vDOM.props !== null) {
        Object.keys(vDOM.props).forEach((key) => {
            element[PROPS_NAMES[key] ?? key] = vDOM.props[key];
        });
    }

    if (vDOM.children !== null) {
        const children = renderDOM(vDOM.children, element, props);
        if (Array.isArray(children)) {
            element.append(...children);
        } else {
            element.appendChild(children);
        }
    }

    vDOM.dom = element;
    vDOM.parent = parent;

    return element;
}

function compareTags(oldTag, newTag) {
    if (oldTag.t !== newTag.t) {
        return { fullRender: true };
    }

    let propsChanged = [];
    Object.keys(oldTag.props).forEach((key) => {
        if (oldTag.props[key] !== newTag.props[key]) {
            propsChanged.push(key);
        }
    });

    return { fullRender: false, propsChanged };
}

function updateDOM(parent, vDOM, newVDOM, props) {
    if (Array.isArray(vDOM) != Array.isArray(newVDOM)) {
        const newElement = renderDOM(newVDOM, props);
        replaceWith(vDOM.dom, newElement.dom);
        return { dom: newVDOM, changed: true };
    }

    if (Array.isArray(vDOM) && Array.isArray(newVDOM)) {
        let changed = false;

        for (let index = 0; index < vDOM.length; index += 1) {
            if (index < newVDOM.length) {
                const updateResult = updateDOM(parent, vDOM[index], newVDOM[index], props);
                vDOM[index] = updateResult.dom;
                changed ||= updateResult.changed;
            } else {
                disposeDOM(vDOM.slice(index), true);
                vDOM.splice(index);
                changed = true;
                break;
            }
        }

        if (newVDOM.length > vDOM.length) {

            const needToAdd = newVDOM.slice(vDOM.length);
            const newElements = renderDOM(needToAdd, parent, props);
            vDOM.push(...needToAdd);
            appendChild(parent, newElements);
            changed = true;
        }

        return { dom: vDOM, changed };
    }

    const changed = compareTags(vDOM, newVDOM);

    if (changed.fullRender) {
        const newElement = renderDOM(newVDOM, props);
        replaceWith(vDOM.dom, newElement.dom);
        return { dom: newVDOM, changed: true };
    }

    if (vDOM.statefull) {
        if (changed.propsChanged.length !== 0) {
            vDOM.component.updateDOM(newVDOM, props);
            return { dom: vDOM, changed: true };
        }

        if (newVDOM.vChildren) {
            const newChildren = updateDOM(vDOM.parent, vDOM.vChildren, newVDOM.vChildren, props);
            if (newChildren.changed) {
                vDOM.component.updateDOM(newVDOM, props);
                return { dom: vDOM, changed: true };
            }
        }
    } else {
        if (changed.propsChanged.length !== 0) {
            changed.propsChanged.forEach((key) => {
                vDOM.dom[PROPS_NAMES[key] ?? key] = newVDOM.props[key];
            });
            vDOM.props = newVDOM.props;
        }

        if (newVDOM.children) {
            vDOM.children = updateDOM(vDOM.dom, vDOM.children, newVDOM.children, props).dom;
        }
    }

    return { dom: vDOM, changed: false };
}

function _tarakan_tag(tagName, props, ...children) {
    if (typeof (tagName) === 'function') {
        return {
            t: tagName,
            statefull: true,
            props: props ?? {},
            vChildren: children,

            component: null,
            children: null,
        };
    }

    return {
        t: tagName,
        props: props ?? {},
        children: children.map((E) => {
            return isScalar(E) ? {
                t: "scalar",
                props: {
                    data: E,
                },
                isScalar: true,
                children: null,
            } : E;
        }),
    }
}

export class Component {

    state = {};

    #renderResult = {
        dom: null,
        props: null,
        sprops: null,
    };

    render() { }

    init() { }
    dispose() { }

    updateDOM(newVDOM, props) {
        if (newVDOM) {
            this.#renderResult.props = newVDOM.props;
            this.#renderResult.dom.vChildren = newVDOM.vChildren;
        }

        const newVDOMFact = this.render(
            this.#renderResult.props,
            this.#renderResult.dom.vChildren,
            props,
        );

        updateDOM(
            this.#renderResult.dom.parent,
            this.#renderResult.dom.children,
            newVDOMFact,
            this.#renderResult.sprops
        );
    }

    renderDOM(vDOM, userProps, systemProps) {
        this.init();

        this.#renderResult = {
            dom: vDOM,
            props: userProps,
            sprops: systemProps,
        };;
        return this.render(userProps, vDOM.vChildren, systemProps);
    }

    disposeDOM() {
        this.dispose();
    }

    setState(newState) {
        let needRender = false;
        for (const key of Object.keys(newState)) {
            if (this.state[key] != newState[key]) {
                needRender = true;
                this.state[key] = newState[key];
            }
        }
        if (needRender) {
            const start = Date.now();
            this.updateDOM();
            const end = Date.now();
            console.log(`Render time: ${end - start} ms`);
        }
    }
}

const tarakan = {
    _tarakan_tag,
    renderDOM,
    Component
}


export default tarakan;