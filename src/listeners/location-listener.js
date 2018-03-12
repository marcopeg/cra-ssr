
import createHistoryRouter from 'lib/redux-history-router'
import { LOCATION_CHANGE } from 'services/location-service'

import {
    fetchPostById,
    fetchCurrentPostAuthor,
    fetchCurrentPostComments,
} from 'services/posts-service'

const applyRoutes = createHistoryRouter([
    {
        path: '/p/:postId/:subMenu(author|comments)?',
        action: ({ postId, subMenu }) => async (dispatch, getState) => {
            // load post data
            const { post } = getState()
            if (post.id !== postId || post.data === null) {
                await dispatch(fetchPostById(postId))
            }

            // load sub-route data
            if (subMenu === 'author') {
                await dispatch(fetchCurrentPostAuthor())
            } else if (subMenu === 'comments') {
                await dispatch(fetchCurrentPostComments())
            }
        },
    },
])

export default [{
    type: LOCATION_CHANGE,
    handler: action => (dispatch, getState) => applyRoutes(action.payload)(dispatch, getState),
}]
