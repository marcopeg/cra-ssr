/*
    global fetch
*/

const localSettings = {
    endpoint: '',
}

export const get = uri =>
    fetch(`${localSettings.endpoint}${uri}`, {
        method: 'GET',
        credentials: 'include',
    })

export const init = (endpoint) => {
    localSettings.endpoint = endpoint
}
