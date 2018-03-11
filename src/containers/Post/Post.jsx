import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const state2props = ({ post }) => ({
    id: post.id,
    isLoading: post.data === null,
    title: post.data ? post.data.title : '',
    body: post.data ? post.data.body : '',
})

const Post = ({
    id,
    title,
    body,
    isLoading,
}) => (
    isLoading ? (
        <div>loading post {id}</div>
    ) : (
        <div>
            <h2>{ title }</h2>
            <div>{body}</div>
        </div >
    )
)

Post.propTypes = {
    id: PropTypes.number,
    isLoading: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
}

Post.defaultProps = {
    id: null,
}

export default connect(state2props)(Post)
