/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

import InputWithFocus from './InputWithFocus'

class InlineEditForm extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        details: PropTypes.shape({
            description: PropTypes.string.isRequired,
            status: PropTypes.bool.isRequired,
            estimate: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
        }).isRequired,
        focusOn: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    static defaultProps = {
        focusOn: 'description',
    }

    state = {
        details: {
            ...this.props.details,
        },
    }

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

    updateEstimate = (evt) => {
        this.setState({
            details: {
                ...this.state.details,
                estimate: evt.target.value,
            },
        })
        setTimeout(this.emitOnChange)
    }

    render () {
        return (
            <div>
                <InputWithFocus
                    hasFocus={this.props.focusOn === 'description'}
                    value={this.state.details.description}
                    onChange={this.updateDescription}
                    onCancel={() => { }}
                />
                <InputWithFocus
                    hasFocus={this.props.focusOn === 'estimate'}
                    value={this.state.details.estimate}
                    onChange={this.updateEstimate}
                    style={{ float: 'right' }}
                />
            </div>
        )
    }
}

export default InlineEditForm
