
import createHistoryRouter from 'lib/redux-history-router'
import { LOCATION_CHANGE } from 'services/location-service'

import {
    fetchPostById,
    fetchCurrentPostAuthor,
    fetchCurrentPostComments,
} from 'services/posts-service'

export const POST_ROUTE_RADIX = '/p/:postId/'
export const POST_ROUTE = `${POST_ROUTE_RADIX}:subMenu(author|comments)?`

const applyRoutes = createHistoryRouter([
    {
        path: POST_ROUTE,
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
