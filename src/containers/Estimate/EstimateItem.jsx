/*
    eslint
        jsx-a11y/click-events-have-key-events: off
*/

import React from 'react'
import PropTypes from 'prop-types'

import InputWithFocus from './InputWithFocus'

const styles = {
    normal: {
        borderBottom: '1px dotted #ddd',
    },
    active: {
        background: '#b2e5ff',
    },
}

class EstimateItem extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        isActive: PropTypes.bool.isRequired,
        isEditable: PropTypes.bool.isRequired,
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
        const content = this.props.isActive && this.props.isEditable
            ? (
                <div>
                    <InputWithFocus
                        value={this.state.details.description}
                        onChange={this.updateDescription}
                        onCancel={() => { }}
                    />
                </div>
            )
            : (
                <div>
                    <span style={{ float: 'right' }}>22m</span>
                    {this.props.details.description}
                </div>
            )
        
        return (
            <div
                onClick={this.getFocus}
                style={this.props.isActive ? styles.active : styles.normal}
            >
                {content}
            </div>
        )
    }
}

export default EstimateItem
