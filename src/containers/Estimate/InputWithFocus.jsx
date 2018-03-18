/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

class InputWithFocus extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        hasFocus: PropTypes.bool,
    }

    static defaultProps = {
        type: 'text',
        value: '',
        hasFocus: false,
    }

    componentDidMount () {
        if (this.props.hasFocus) {
            this.input.focus()
            this.input.select()
        }
    }

    // updateValue = evt =>
    //     this.setState({
    //         currentValue: evt.target.value,
    //     })

    // handleKeyUp = (evt) => {
    //     switch (evt.key) {
    //         case 'Enter': {
    //             this.props.onChange(this.state.currentValue)
    //             break
    //         }
    //         case 'Escape': {
    //             this.props.onCancel()
    //             break
    //         }
    //         default: {} // eslint-disable-line
    //     }
    // }

    render () {
        const { hasFocus, ...props } = this.props
        return (
            <input
                {...props}
                ref={(input) => { this.input = input }}
            />
        )
    }
}

export default InputWithFocus
