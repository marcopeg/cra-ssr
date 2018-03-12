
export const initialState = {
    items: null,
}

/**
 * Actions
 */

export const INIT_FETCH = 'initFetch@posts-list'
export const SET_ITEMS = 'setItems@posts-list'

export const initFetch = () => ({
    type: INIT_FETCH,
})

export const setItems = items => ({
    type: SET_ITEMS,
    payload: items,
})


/**
 * Handlers
 */

export const actionHandlers = {
    [INIT_FETCH]: state => ({
        ...state,
        items: null,
    }),
    [SET_ITEMS]: (state, action) => ({
        ...state,
        items: action.payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer

