
export const initialState = {
    list: null,
    details: {
        // [id]: { ...user-details }
    },
    current: null,
}

/**
 * Actions
 */

export const SET_LIST = 'setList@user'
export const SET_ITEM = 'setItem@user'
export const SET_CURRENT = 'setCurrent@user'

export const setList = items => ({
    type: SET_LIST,
    payload: items,
})

export const setItem = (id, data) => ({
    type: SET_ITEM,
    payload: { id, data },
})

export const setCurrent = id => ({
    type: SET_CURRENT,
    payload: id,
})

/**
 * Handlers
 */

export const actionHandlers = {
    [SET_LIST]: (state, action) => ({
        ...state,
        list: action.payload,
    }),
    [SET_ITEM]: (state, action) => ({
        ...state,
        details: {
            ...state.details,
            [action.payload.id]: action.payload.data,
        },
    }),
    [SET_CURRENT]: (state, action) => ({
        ...state,
        current: action.payload,
    }),
}

export const reducer = (state = initialState, action) => {
    const handler = actionHandlers[action.type]
    return handler ? handler(state, action) : state
}

export default reducer

