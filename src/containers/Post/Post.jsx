/*
    eslint
        jsx-a11y/anchor-is-valid: off
*/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Route, Link } from 'react-router-dom'

import { POST_ROUTE_RADIX } from 'listeners/location-listener'

import Author from 'components/Author'
import Comments from 'components/Comments'

const state2props = ({ post, user }) => ({
    id: post.id,
    isLoading: post.data === null,
    title: post.data ? post.data.title : '',
    body: post.data ? post.data.body : '',
    author: user.data,
    comments: post.comments,
})

const Post = ({
    id,
    title,
    body,
    isLoading,
    author,
    comments,
}) => (
    isLoading ? (
        <div>loading post {id}</div>
    ) : (
        <div style={{ textAlign: 'left', margin: 20 }}>
            <Helmet><title>{`post - ${title}`}</title></Helmet>
            <h2>{title}</h2>
            <div>{body}</div>
            <hr />
            <Link to={`/p/${id}/author`}>Author</Link>
            {' | '}
            <Link to={`/p/${id}/comments`}>Comments</Link>
            <hr />
            <Route
                path={`${POST_ROUTE_RADIX}author`}
                component={() => (author ? <Author {...author} /> : <span>loading...</span>)}
            />
            <Route
                path={`${POST_ROUTE_RADIX}comments`}
                component={() => (comments ? <Comments list={comments} /> : <span>loading...</span>)}
            />
        </div >
    )
)

Post.propTypes = {
    id: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    author: PropTypes.object, // eslint-disable-line
    comments: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line
}

Post.defaultProps = {
    id: null,
    author: null,
    comments: null,
}

export default connect(state2props)(Post)
