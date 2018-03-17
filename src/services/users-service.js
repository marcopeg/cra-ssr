/*
    eslint
        import/prefer-default-export: off
*/

import { getJSON } from 'lib/request'
// import { initFetch, setData } from 'reducers/user-reducer'
import { setList, setItem, setCurrent } from 'reducers/users-reducer'

export const fetchUsers = () => async (dispatch, getState) => {
    const { ssr, users } = getState()

    // cache result
    if (users.list) {
        return users.list
    }

    // get fresh posts
    const items = await ssr.await(getJSON('https://jsonplaceholder.typicode.com/users'))
    dispatch(setList(items))

    return items
}

export const fetchUserById = userId => async (dispatch, getState) => {
    const { ssr, users } = getState()

    // cache result
    if (users.details[userId]) {
        return users.details[userId]
    }

    // dispatch(initFetch(userId))
    const data = await ssr.await(getJSON(`https://jsonplaceholder.typicode.com/users/${userId}`))
    // dispatch(setData(data))
    dispatch(setItem(userId, data))

    return data
}

export const fetchCurrentUser = userId => async (dispatch) => {
    dispatch(setCurrent(userId))
    dispatch(fetchUserById(userId))
}
