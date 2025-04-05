const PROPS_NAMES = {
    "onClick": "onclick",
    "onChange": "oninput",
    "onEnd": "onchange",
    "onMouseOver": "onmouseover",
    "onMouseLeave": "onmouseleave",
    "onFocus": "onfocus",
    "onFocusOut": "onfocusout",
    "onBlur": "onblur",
}

function isScalar(d) {
    return typeof (d) === "string" || typeof (d) === "number";
}

function isObject(obj) {
    return obj != null && typeof obj === "object";
}

function equal(obj1, obj2) {
    if (!isObject(obj1) && !isObject(obj2)) {
        return obj1 === obj2;
    }

    if (isObject(obj1) != isObject(obj2)) {
        return false;
    }

    const objKeys1 = Object.keys(obj1);
    const objKeys2 = Object.keys(obj2);

    if (objKeys1.length !== objKeys2.length) return false;

    for (var key of objKeys1) {
        const value1 = obj1[key];
        const value2 = obj2[key];

        const isObjects = isObject(value1) && isObject(value2);

        if ((isObjects && !equal(value1, value2)) || (!isObjects && value1 !== value2)) {
            return false;
        }
    }
    return true;
};

function replaceWith(oldElement, newElement) {
    if (!oldElement || !newElement) {
        return;
    }

    if (Array.isArray(oldElement)) {
        oldElement.at(-1).replaceWith(newElement);
    } else {
        if (Array.isArray(newElement)) {
            oldElement.replaceWith(...newElement);
        } else {
            oldElement.replaceWith(newElement);
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
        if (oldTag.statefull) {
            if (oldTag.component.deepProps.includes(key)) {
                if (!equal(oldTag.props[key], newTag.props[key])) {
                    propsChanged.push(key);
                }
            } else {
                if (oldTag.props[key] != newTag.props[key]) {
                    propsChanged.push(key);
                }
            }
        } else {
            if (oldTag.props[key] != newTag.props[key]) {
                propsChanged.push(key);
            }
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
        const newElement = renderDOM(newVDOM, parent, props);
        replaceWith(vDOM.dom, newElement);
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
            vChildren: children.map((E) => {
                return isScalar(E) ? {
                    t: "scalar",
                    props: {
                        data: E,
                    },
                    isScalar: true,
                    children: null,
                } : E;
            }).filter((E) => (E)),

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
        }).filter((E) => (E)),
    }
}

export class Reference {
    target = null;

    connect(component) {
        this.target = component;
    }
}

export class Component {

    deepProps = [];
    state = {};
    #subscribers = {};

    get props() {
        return this.#renderResult.props;
    }

    get app() {
        return this.#renderResult.sprops;
    }

    #renderResult = {
        dom: null,
        props: null,
        sprops: null,
    };

    render() { }

    init() { }
    update(newProps) { }
    dispose() { }

    subscribe(storeName, handler) {
        this.#subscribers[storeName] = this.app.store[storeName].subscribe(handler);
    }

    unsubscribe(storeName) {
        this.app.store[storeName].unsubscribe(this.#subscribers[storeName]);
        delete this.#subscribers[storeName];
    }

    updateDOM(newVDOM, props) {
        if (newVDOM) {
            this.update(newVDOM.props);
            this.#renderResult.props = newVDOM.props;
            this.#renderResult.sprops = props;
            this.#renderResult.dom.vChildren = newVDOM.vChildren;
        }

        if (this.#renderResult.props.ref) this.#renderResult.props.ref.connect(this);

        const newVDOMFact = this.render(
            { ...this.#renderResult.props, children: this.#renderResult.dom.vChildren },
            this.#renderResult.sprops,
        );

        updateDOM(
            this.#renderResult.dom.parent,
            this.#renderResult.dom.children,
            newVDOMFact,
            this.#renderResult.sprops
        );
    }

    renderDOM(vDOM, userProps, systemProps) {
        if (userProps.ref) userProps.ref.connect(this);
        this.#renderResult = {
            dom: vDOM,
            props: userProps,
            sprops: systemProps,
        };
        this.init(userProps);
        return this.render({ ...userProps, children: vDOM.vChildren }, systemProps);
    }

    disposeDOM() {
        this.dispose();
        Object.keys((storeName) => {
            this.app.store[storeName].unsubscribe(this.#subscribers[storeName]);
        });
    }

    setState(newState, ignoreUpdate = false) {
        let needRender = false;
        for (const key of Object.keys(newState)) {
            if (this.state[key] != newState[key]) {
                needRender = true;
                this.state[key] = newState[key];
            }
        }
        if (needRender && !ignoreUpdate) {
            const start = Date.now();
            this.updateDOM();
            const end = Date.now();
            console.log(`Render time: ${end - start} ms`);
        }
    }
}

class Page404 extends Component {
    render() {
        return <div style="padding: 16px">
            <h1>Данная страница не найдена {":<("}</h1>
            <hr style="margin-top: 16px; border: 2px solid lightgray" />
        </div>
    }
}

export class Store {
    value = null;
    #initAction = null;

    #actions = {};
    #subscribers = {};
    #subscriberIndex = 0;

    constructor(initValue, initAction) {
        this.value = initValue;
        this.#initAction = initAction;
    }

    init() {
        this.#initAction(this);
    }

    subscribe(callback) {
        const subKey = this.#subscriberIndex;
        this.#subscriberIndex += 1;
        this.#subscribers[subKey] = callback;
        return subKey;
    }

    unsubscribe(subscriberIndex) {
        delete this.#subscribers[subscriberIndex];
    }

    async sendAction(name, newValue) {
        if (this.#actions[name] === undefined) {
            this.value = newValue;
            Object.values(this.#subscribers).forEach((subscriber) => {
                subscriber(name, newValue);
            });
        } else {
            return await this.#actions[name](this, newValue);
        }
    }

    addAction(name, handler) {
        this.#actions[name] = handler;
    }
}

export class Application {

    routes = {};
    path = "";

    #renderDom = null;
    #stores = {};

    constructor(routes) {
        this.routes = routes;
        this.path = window.location.pathname;

        window.addEventListener("popstate", (ev) => {
            this.#showPage(window.location.pathname);
        });
        window.addEventListener("pushstate", (ev) => {
            this.#showPage(window.location.pathname);
        });
    }

    render(container) {
        const Page = this.routes[this.path] ?? Page404;

        this.#renderDom = <Page />;
        container.appendChild(renderDOM(this.#renderDom, container, {
            navigateTo: (path) => this.navigateTo(path),
            store: this.#stores,
        }));

        Object.values(this.#stores).forEach((store) => store.init());
    }

    navigateTo(path) {
        window.history.pushState({}, "", path);
        this.#showPage(path)
    }

    #showPage(path) {
        this.path = path;
        const NewPage = this.routes[this.path] ?? Page404;
        const newRender = <NewPage />;

        updateDOM(
            this.#renderDom.parent,
            this.#renderDom,
            newRender,
            {
                navigateTo: (path) => this.navigateTo(path),
                store: this.#stores,
            }
        )
        this.#renderDom = newRender;
    }

    addStore(name, store) {
        this.#stores[name] = store;
    }
}

const Tarakan = {
    _tarakan_tag,
    renderDOM,
    Reference,
    Component,
    Application,
    Store
}


export default Tarakan;
