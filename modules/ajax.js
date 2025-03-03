export const ContentTypes = {
    JSON: "application/json",
    FORM: "multipart/form-data"
}

/**
 * Запрос GET
 * @param {String} url URL запроса
 * @param {{ origin: String }} options Параметры запроса
 * @returns {Promise<{ error: false, result: Response } | { error: true, message: error }>}
 */
export const get = async (url, options) => {
    const headers = new Headers();
    return new Promise((resolve, reject) => {
        fetch(`${options?.origin ?? window.location.origin}/${url}`, {
            method: "GET",
            headers: headers,
            credentials: "same-origin",
        })
            .then((res) => resolve({ error: false, result: res }))
            .catch((err) => resolve({ error: true, message: err }))
    })
}

/**
 * Запрос POST
 * @param {String} url URL запроса
 * @param {object} data Тело запроса
 * @param {{ type: ContentTypes?, origin: String }} options Параметры запроса
 * @returns {Promise<{ error: false, result: Response } | { error: true, message: error }>}
 */
export const post = async (url, data, options) => {
    const headers = new Headers();
    headers.append("Content-Type", options?.type ?? ContentTypes.JSON);
    return new Promise((resolve, reject) => {
        fetch(`${options?.origin ?? window.location.origin}/${url}`, {
            method: "POST",
            headers: headers,
            credentials: "same-origin",
            body: (options?.type ?? ContentTypes.JSON) == ContentTypes.JSON ? JSON.stringify(data) : data,
        })
            .then((res) => resolve({ error: false, result: res }))
            .catch((err) => resolve({ error: true, message: err }))
    })
}

/**
 * Запрос PUT
 * @param {String} url URL запроса
 * @param {object} data Тело запроса
 * @param {{ type: ContentTypes?, origin: String }} options Параметры запроса
 * @returns {Promise<{ error: false, result: Response } | { error: true, message: error }>}
 */
export const put = async (url, data, options) => {
    const headers = new Headers();
    headers.append("Content-Type", options?.type ?? ContentTypes.JSON);
    return new Promise((resolve, reject) => {
        fetch(`${options?.origin ?? window.location.origin}/${url}`, {
            method: "PUT",
            headers: headers,
            credentials: "same-origin",
            body: (options?.type ?? ContentTypes.JSON) == ContentTypes.JSON ? JSON.stringify(data) : data,
        })
            .then((res) => resolve({ error: false, result: res }))
            .catch((err) => resolve({ error: true, message: err }))
    })
}

/**
 * Запрос DELETE
 * @param {String} url URL запроса
 * @param {object} data Тело запроса
 * @param {{ type: ContentTypes?, origin: String }} options Параметры запроса
 * @returns {Promise<{ error: false, result: Response } | { error: true, message: error }>}
 */
export const del = async (url, data, options) => {
    const headers = new Headers();
    headers.append("Content-Type", options?.type ?? ContentTypes.JSON);
    return new Promise((resolve, reject) => {
        fetch(`${options?.origin ?? window.location.origin}/${url}`, {
            method: "DELETE",
            headers: headers,
            credentials: "same-origin",
            body: (options?.type ?? ContentTypes.JSON) == ContentTypes.JSON ? JSON.stringify(data) : data,
        })
            .then((res) => resolve({ error: false, result: res }))
            .catch((err) => resolve({ error: true, message: err }))
    })
}

/**
 * Запрос PATCH
 * @param {String} url URL запроса
 * @param {object} data Тело запроса
 * @param {{ type: ContentTypes?, origin: String }} options Параметры запроса
 * @returns {Promise<{ error: false, result: Response } | { error: true, message: error }>}
 */
export const patch = async (url, data, options) => {
    const headers = new Headers();
    headers.append("Content-Type", options?.type ?? ContentTypes.JSON);
    return new Promise((resolve, reject) => {
        fetch(`${options?.origin ?? window.location.origin}/${url}`, {
            method: "PATCH",
            headers: headers,
            credentials: "same-origin",
            body: (options?.type ?? ContentTypes.JSON) == ContentTypes.JSON ? JSON.stringify(data) : data,
        })
            .then((res) => resolve({ error: false, result: res }))
            .catch((err) => resolve({ error: true, message: err }))
    })
}

export default {
    ContentTypes,
    get, post, put, del
}