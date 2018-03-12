
import createHistoryRouter from 'lib/redux-history-router'
import { LOCATION_CHANGE } from 'services/location-service'
import { fetchPostById } from 'services/posts-service'

export const POST_ROUTE_RADIX = '/p/:postId/'
export const POST_ROUTE = `${POST_ROUTE_RADIX}(author|comments)?`

const applyRoutes = createHistoryRouter([
    {
        path: POST_ROUTE,
        action: ({ postId }) => (dispatch, getState) => {
            const { post } = getState()
            if (post.id !== postId || post.data === null) {
                dispatch(fetchPostById(postId))
            }
        },
    },
])

export default [{
    type: LOCATION_CHANGE,
    handler: action => (dispatch, getState) => applyRoutes(action.payload)(dispatch, getState),
}]
