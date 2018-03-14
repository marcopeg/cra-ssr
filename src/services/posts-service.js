/*
    eslint
        import/prefer-default-export: off
*/

import { getJSON } from 'lib/request'
import { initFetch, setData, setComments } from 'reducers/post-reducer'
import {
    initFetch as initPosts,
    setItems as setPosts,
} from 'reducers/posts-list-reducer'
import { fetchUserById } from 'services/users-service'

export const fetchPosts = () => async (dispatch, getState) => {
    const { ssr, postsList } = getState()

    // check local cache to avoid to reload posts
    if (postsList.items !== null) {
        return postsList.items
    }

    // get fresh posts
    dispatch(initPosts())
    console.log('load posts')
    const items = await ssr.await(getJSON('https://jsonplaceholder.typicode.com/posts'))
    dispatch(setPosts(items))

    return items
}

export const fetchPostById = postId => async (dispatch, getState) => {
    const { ssr } = getState()

    dispatch(initFetch(postId))
    const data = await ssr.await(getJSON(`https://jsonplaceholder.typicode.com/posts/${postId}`))
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
    const { ssr, post } = getState()

    if (post.comments !== null) {
        return
    }

    const data = await ssr.await(getJSON(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`))
    dispatch(setComments(data))
}
