
export const initialState = {
    id: null,
    data: null,
}

/**
 * Actions
 */

export const INIT_FETCH = 'initFetch@post'
export const SET_DATA = 'setData@post'

export const initFetch = productId => ({
    type: INIT_FETCH,
    payload: productId,
})

export const setData = data => ({
    type: SET_DATA,
    payload: data,
})


/**
 * Handlers
 */

export const actionHandlers = {
    [INIT_FETCH]: (state, action) => ({
        ...state,
        id: action.payload,
        data: null,
    }),
    [SET_DATA]: (state, action) => ({
        ...state,
        data: action.payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer

