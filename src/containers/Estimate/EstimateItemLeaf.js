/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

import InlineEditForm from './InlineEditForm'
import minutes from './minutes'

class EstimateItemLeaf extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        isEditable: PropTypes.bool.isRequired,
        details: PropTypes.shape({
            description: PropTypes.string.isRequired,
            status: PropTypes.bool.isRequired,
            estimate: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
        }).isRequired,
        estimate: PropTypes.number,
        onToggleStatus: PropTypes.func.isRequired,
    }

    static defaultProps = {
        estimate: null,
    }

    render () {
        const status = this.props.details.status
            ? '[x] '
            : '[] '

        const content = this.props.isActive && this.props.isEditable
            ? <InlineEditForm {...this.props} />
            : (
                <div>
                    <span style={{ float: 'right' }}>{minutes(this.props.estimate)}</span>
                    <span onClick={this.props.onToggleStatus}>{status}</span>
                    {this.props.details.description}
                </div>
            )
        return content
    }
}

export default EstimateItemLeaf
