import React from 'react'
import PropTypes from 'prop-types'

import EstimateItemLeaf from './EstimateItemLeaf'
import EstimateItemNode from './EstimateItemNode'

const EstimateItem = props => (
    props.isLeafNode
        ? <EstimateItemLeaf {...props} />
        : <EstimateItemNode {...props} />
)

EstimateItem.propTypes =  {
    isLeafNode: PropTypes.bool.isRequired,
}

export default EstimateItem
