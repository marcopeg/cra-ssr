/*
    eslint
        jsx-a11y/click-events-have-key-events: off,
*/

import React from 'react'
import PropTypes from 'prop-types'

import EstimateItemLeaf from './EstimateItemLeaf'
import EstimateItemNode from './EstimateItemNode'

const styles = {
    normal: {
        border: '1px solid transparent',
        borderBottom: '1px dotted #ddd',
        padding: '2px 5px',
    },
    active: {
        border: '1px solid #47bde8',
        background: '#afe4ff',
        borderRadius: 4,
        padding: '2px 5px',
    },
}

const EstimateItem = (props) => {
    const content = props.isLeafNode
        ? <EstimateItemLeaf {...props} />
        : <EstimateItemNode {...props} />

    return (
        <div
            onClick={() => props.onFocus(props.id)}
            style={props.isActive ? styles.active : styles.normal}
        >
            {content}
        </div>
    )
}

EstimateItem.propTypes = {
    isLeafNode: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
}

export default EstimateItem
