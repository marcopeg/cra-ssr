/*
    eslint
        import/prefer-default-export: off
*/

import { getJSON } from 'lib/request'
import { initFetch, setData } from 'reducers/post-reducer'

export const fetchPostById = postId => async (dispatch) => {
    dispatch(initFetch(postId))
    const data = await getJSON(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    dispatch(setData(data))
}
