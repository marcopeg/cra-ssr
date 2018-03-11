
import { SET_DATA } from 'reducers/post-reducer'
import { fetchUserById } from 'services/users-service'

export default [{
    action: SET_DATA,
    handler: action => dispatch => dispatch(fetchUserById(action.payload.userId)),
}]
