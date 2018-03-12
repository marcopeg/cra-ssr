
export const initialState = {
    id: null,
    data: null,
    comments: null,
}

/**
 * Actions
 */

export const INIT_FETCH = 'initFetch@post'
export const SET_DATA = 'setData@post'
export const SET_COMMENTS = 'setComments@post'

export const initFetch = postId => ({
    type: INIT_FETCH,
    payload: postId,
    comments: null,
})

export const setData = data => ({
    type: SET_DATA,
    payload: data,
})

export const setComments = comments => ({
    type: SET_COMMENTS,
    payload: comments,
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
    [SET_COMMENTS]: (state, action) => ({
        ...state,
        comments: action.payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer

