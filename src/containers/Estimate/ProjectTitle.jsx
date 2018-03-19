/*
    eslint
        jsx-a11y/click-events-have-key-events: off,
        jsx-a11y/no-noninteractive-element-interactions: off,
*/

import React from 'react'
import PropTypes from 'prop-types'
import InputWithFocus from './InputWithFocus'

const styles = {}
styles.show = {
    marginBottom: 0,
    fontWeight: 'normal',
}
styles.input = {
    fontFamily: 'verdana',
    marginRight: 5,
    fontSize: '24px',
    outline: 'none',
    border: '0px solid #fff',
    margin: 0,
    padding: 0,
}
styles.btn = {
    display: 'inline-block',
    marginLeft: 5,
}
styles.btnSave = {
    ...styles.btn,
}
styles.btnCancel = {
    ...styles.btn,
    border: '0px solid #fff',
    background: 'transparent',
}

class ProjectTitle extends React.Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        onEditStart: PropTypes.func.isRequired,
        onEditEnd: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    state = {
        isEditMode: false,
        value: this.props.value,
    }

    startEdit = () => {
        this.setState({
            value: this.props.value,
            isEditMode: true,
        })
        this.props.onEditStart()
    }

    updateValue = evt => this.setState({
        value: evt.target.value,
    })

    save = () => {
        this.props.onChange(this.state.value)
        this.props.onEditEnd()
        this.setState({
            isEditMode: false,
        })
    }

    cancel = () => {
        this.setState({
            isEditMode: false,
            value: this.props.value,
        })
        this.props.onEditEnd()
    }

    keyboard = (evt) => {
        switch (evt.key) {
            case 'Enter': {
                evt.preventDefault()
                evt.stopPropagation()
                setTimeout(() => this.save())
                break
            }
            case 'Escape': {
                evt.preventDefault()
                evt.stopPropagation()
                setTimeout(() => this.cancel())
                break
            }
            default: {} // eslint-disable-line
        }
    }

    render () {
        if (!this.state.isEditMode) {
            return (
                <h2
                    onClick={this.startEdit}
                    style={styles.show}
                >
                    {this.props.value}
                </h2>
            )
        }

        return (
            <div>
                <InputWithFocus
                    hasFocus
                    value={this.state.value}
                    onChange={this.updateValue}
                    onKeyPress={this.keyboard}
                    style={styles.input}
                />
                <button onClick={this.save} style={styles.btnSave}>save</button>
                <button onClick={this.cancel} style={styles.btnCancel}>cancel</button>
            </div>
        )
    }
}

export default ProjectTitle
