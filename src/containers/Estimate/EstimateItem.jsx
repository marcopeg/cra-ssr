/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

import InputWithFocus from './InputWithFocus'

class EstimateItem extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        details: PropTypes.shape({
            description: PropTypes.string.isRequired,
        }).isRequired,
        onFocus: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    state = {
        details: {
            ...this.props.details,
        },
    }

    getFocus = () => this.props.onFocus(this.props.id)

    emitOnChange = () => {
        this.props.onChange(this.props.id, this.state.details)
    }

    updateDescription = (evt) => {
        this.setState({
            details: {
                ...this.state.details,
                description: evt.target.value,
            },
        })
        setTimeout(this.emitOnChange)
    }

    render () {
        if (this.props.isActive) {
            return (
                <div>
                    <InputWithFocus
                        value={this.state.details.description}
                        onChange={this.updateDescription}
                        onCancel={() => {}}
                    />
                </div>
            )
        }
        return (
            <div onClick={this.getFocus}>
                {this.props.details.description}
            </div>
        )
    }
}

export default EstimateItem
