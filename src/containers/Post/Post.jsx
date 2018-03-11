import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import Author from 'components/Author'

const state2props = ({ post, user }) => ({
    id: post.id,
    isLoading: post.data === null,
    title: post.data ? post.data.title : '',
    body: post.data ? post.data.body : '',
    author: user.data,
})

const Post = ({
    id,
    title,
    body,
    isLoading,
    author,
}) => (
    isLoading ? (
        <div>loading post {id}</div>
    ) : (
        <div style={{ textAlign: 'left', margin: 20 }}>
            <Helmet><title>{`post - ${title}`}</title></Helmet>
            <h2>{title}</h2>
            <div>{body}</div>
            {author ? <Author {...author} /> : <span>loading...</span>}
        </div >
    )
)

Post.propTypes = {
    id: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    author: PropTypes.object, // eslint-disable-line
}

Post.defaultProps = {
    id: null,
    author: null,
}

export default connect(state2props)(Post)
