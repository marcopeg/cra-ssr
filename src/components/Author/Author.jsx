import React from 'react'
import PropTypes from 'prop-types'

const Author = ({ name }) => (
    <div>
        <hr />
        <div>
            by: {name}
        </div>
    </div>
)

Author.propTypes = {
    name: PropTypes.string.isRequired,
}


export default Author
