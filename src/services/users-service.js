/*
    eslint
        import/prefer-default-export: off
*/

import { getJSON } from 'lib/request'
import { initFetch, setData } from 'reducers/user-reducer'

export const fetchUserById = userId => async (dispatch) => {
    dispatch(initFetch(userId))
    const data = await getJSON(`https://jsonplaceholder.typicode.com/users/${userId}`)
    dispatch(setData(data))

    return data
}
