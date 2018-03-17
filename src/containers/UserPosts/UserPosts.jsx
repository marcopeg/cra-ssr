/*
    eslint
        react/prefer-stateless-function: off,
        jsx-a11y/anchor-is-valid: off
*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchUserPosts } from 'services/users-service'
import { Link } from 'react-router-dom'

const state2props = ({ users }, { userId }) => ({
    userId,
    items: users.posts[userId]
        ? users.posts[userId]
        : null,
})

const dispatch2props = {
    fetchUserPosts,
}

class UserPosts extends React.Component {
    componentWillMount () {
        this.props.fetchUserPosts(this.props.userId)
    }

    render () {
        if (!this.props.items) {
            return (<div>loading user posts...</div>)
        }

        return (
            <div>
                <h1>User Posts</h1>
                {this.props.items.map(post => (
                    <li>
                        <Link to={`/p/${post.id}`}>{post.title}</Link>
                    </li>
                ))}
            </div>
        )
    }
}

UserPosts.propTypes = {
    userId: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    })),
    fetchUserPosts: PropTypes.func.isRequired,
}

UserPosts.defaultProps = {
    items: null,
}

export default connect(state2props, dispatch2props)(UserPosts)
