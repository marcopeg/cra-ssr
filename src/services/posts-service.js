/*
    eslint
        import/prefer-default-export: off
*/

import { getJSON } from 'lib/request'
import { initFetch, setData, setComments } from 'reducers/post-reducer'
import { fetchUserById } from 'services/users-service'

export const fetchPostById = postId => async (dispatch) => {
    dispatch(initFetch(postId))
    const data = await getJSON(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    dispatch(setData(data))

    return data
}

export const fetchCurrentPostAuthor = () => async (dispatch, getState) => {
    const { post, user } = getState()
    const { userId } = post.data || {}

    if (user.id !== userId || user.data === null) {
        return dispatch(fetchUserById(userId))
    }

    return user.data
}

export const fetchCurrentPostComments = () => async (dispatch, getState) => {
    const { post } = getState()
    if (post.comments !== null) {
        return
    }

    const data = await getJSON(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
    dispatch(setComments(data))
}
