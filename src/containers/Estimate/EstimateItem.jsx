/*
    eslint
        jsx-a11y/click-events-have-key-events: off,
        no-nested-ternary: off,
*/

import React from 'react'
import PropTypes from 'prop-types'

import EstimateItemLeaf from './EstimateItemLeaf'
import EstimateItemNode from './EstimateItemNode'

const styles = {}
styles.basics = {
    border: '1px solid transparent',
    padding: '2px 5px',
}
styles.normal = {
    ...styles.basics,
    borderBottom: '1px dotted #ddd',
}
styles.active = {
    ...styles.basics,
    border: '1px solid #47bde8',
    background: '#afe4ff',
    borderRadius: 4,
}
styles.completed = {
    ...styles.normal,
    background: '#d3ead4',
    borderRadius: 4,
    borderColor: '#badbbb',
}
styles.activeAndCompleted = {
    ...styles.active,
    background: '#d3ead4',
    borderColor: 'green',
}

const EstimateItem = (props) => {
    const content = props.isLeafNode
        ? <EstimateItemLeaf {...props} />
        : <EstimateItemNode {...props} />

    return (
        <div
            onClick={() => props.onFocus(props.id)}
            style={
                props.isActive
                    ? props.details.status
                        ? styles.activeAndCompleted
                        : styles.active
                    : props.details.status
                        ? styles.completed
                        : styles.normal
            }
        >
            {content}
        </div>
    )
}

EstimateItem.propTypes = {
    id: PropTypes.number.isRequired,
    isLeafNode: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    onFocus: PropTypes.func.isRequired,
    details: PropTypes.shape({
        status: PropTypes.bool.isRequired,
    }).isRequired,
}

export default EstimateItem
