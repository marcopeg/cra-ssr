/*
    eslint
        import/prefer-default-export: off
*/

import createHistoryRouter from 'lib/redux-history-router'
import { fetchPostById } from 'services/posts-service'

const applyRoutes = createHistoryRouter([
    {
        path: '/p/:postId',
        action: ({ postId }) => (dispatch, getState) => {
            const { post } = getState()
            if (post.id !== postId || post.data === null) {
                dispatch(fetchPostById(postId))
            }
        },
    },
])

export const init = (store, history) => (dispatch, getState) =>
    history.listen(match => applyRoutes(match)(dispatch, getState))

export const start = (store, history) => (dispatch, getState) =>
    applyRoutes(history.location)(dispatch, getState)
