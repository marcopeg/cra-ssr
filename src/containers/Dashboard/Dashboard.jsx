/*
    eslint
        react/prefer-stateless-function: off,
        jsx-a11y/anchor-is-valid: off
*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchPosts } from 'services/posts-service'

const state2props = ({ app, postsList }) => ({
    title: app.name,
    posts: postsList.items,
})

const dispatch2props = {
    fetchPosts,
}

class Dashboard extends React.Component {
    componentWillMount () {
        console.log('component did mount')
        this.props.fetchPosts()
    }

    render () {
        return (
            <div style={{ textAlign: 'left', margin: 20 }}>
                <h1>Dashboard - {this.props.title}</h1>
                <hr />
                {this.props.posts
                    ? (
                        this.props.posts.map(item => (
                            <li key={item.id}>
                                <Link to={`/p/${item.id}`}>{item.title}</Link>
                            </li>
                        ))
                    )
                    : (
                        <div>loading...</div>
                    )
                }
            </div>
        )
    }
}

Dashboard.propTypes = {
    title: PropTypes.string.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    posts: PropTypes.array, // eslint-disable-line
}

Dashboard.defaultProps = {
    posts: null,
}


export default connect(state2props, dispatch2props)(Dashboard)
