/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

class InputWithFocus extends React.Component {
    static propTypes = {
        value: PropTypes.string,
    }

    static defaultProps = {
        value: '',
    }

    componentDidMount () {
        this.input.focus()
        setTimeout(() => {
            this.input.value = `${this.props.value} `
            setTimeout(() => {
                this.input.value = this.props.value
            })
        })
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
        return (
            <input
                {...this.props}
                ref={(input) => { this.input = input }}
                type="text"
            />
        )
    }
}

export default InputWithFocus
