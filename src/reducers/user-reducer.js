
export const initialState = {
    id: null,
    data: null,
}

/**
 * Actions
 */

export const INIT_FETCH = 'initFetch@user'
export const SET_DATA = 'setData@user'

export const initFetch = postId => ({
    type: INIT_FETCH,
    payload: postId,
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

