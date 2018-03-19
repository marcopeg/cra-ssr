/*
    eslint
        jsx-a11y/click-events-have-key-events: off,
        jsx-a11y/no-noninteractive-element-interactions: off,
*/

import React from 'react'

const styles = {}
styles.wrapper = {
    padding: 5,
}
styles.title = {
    fontWeight: 'normal',
    fontSize: '12pt',
    margin: 0,
}
styles.shortcuts = {
    background: '#ddd',
    padding: 5,
    overflow: 'auto',
    margin: 0,
    marginTop: 5,
    borderRadius: 4,
}

class Help extends React.Component {
    state = {
        isOpen: true,
    }

    toggle = () => this.setState({
        isOpen: !this.state.isOpen,
    })

    render () {
        return (
            <div style={styles.wrapper}>
                <h3 onClick={this.toggle} style={styles.title}>
                    {this.state.isOpen ? (
                        '- Keyboard Shortcuts:'
                    ) : (
                        'Show Keyboard Shortcuts'
                    )}
                </h3>
                {this.state.isOpen ? (
                    <pre style={styles.shortcuts}>
                        "a", "+", "alt + Enter" -> Add new requirement<br />
                        "Enter" -> activate / deactivate edit mode<br />
                        "e" -> enter editing mode and focus on the estimate field<br />
                        "Space" -> collapse sections or mark a requirement as done<br />
                        "s" -> save project to disk<br />
                        "o" -> open a saved project<br />
                        "n" -> start a new project<br />
                    </pre>
                ) : null}
            </div>
        )
    }
}

export default Help
