/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

import InputWithFocus from './InputWithFocus'

const styles = {}
styles.input = {
    fontFamily: 'verdana',
    fontSize: '11pt',
    background: '#fff',
    border: '1px solid transparent',
    outline: 'none',
}
styles.wrapper = {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
}
styles.description = {
    ...styles.input,
    flex: 1,
}
styles.estimate = {
    ...styles.input,
    width: 50,
    textAlign: 'right',
}

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
            <div style={styles.wrapper}>
                <InputWithFocus
                    hasFocus={this.props.focusOn === 'description'}
                    value={this.state.details.description}
                    onChange={this.updateDescription}
                    onCancel={() => { }}
                    style={styles.description}
                />
                <InputWithFocus
                    hasFocus={this.props.focusOn === 'estimate'}
                    value={this.state.details.estimate}
                    onChange={this.updateEstimate}
                    style={styles.estimate}
                />
            </div>
        )
    }
}

export default InlineEditForm
