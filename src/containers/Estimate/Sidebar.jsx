import React from 'react'
import PropTypes from 'prop-types'

import Help from './Help'

const styles = {}
styles.wrapper = {
    display: 'flex',
    flexDirection: 'column',
    width: '30vw',
    minWidth: 300,
    overflow: 'auto',
    borderLeft: '2px solid #666',
    marginLeft: 5,
}
styles.main = {
    padding: 5,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
}
styles.help = {
    borderTop: '2px solid #666',
}
styles.title = {
    fontSize: '12pt',
    margin: 0,
    padding: 10,
}
styles.notes = {
    flex: 1,
    height: 100,
    fontSize: '12pt',
    outline: 'none',
    padding: 10,
    borderRadius: 4,
    borderColor: '#666',
}

const Sidebar = ({
    description,
    notes,
    updateField,
    onEditStart,
    onEditEnd,
}) => (
    <div style={styles.wrapper}>
        <div style={styles.main}>
            <h3 style={styles.title}>{description}</h3>
            <textarea
                style={styles.notes}
                value={notes}
                onChange={updateField('notes')}
                onFocus={onEditStart}
                onBlur={onEditEnd}
            />
        </div>
        <div style={styles.help}>
            <Help />
        </div>
    </div>
)

Sidebar.propTypes = {
    description: PropTypes.string,
    notes: PropTypes.string,
    updateField: PropTypes.func.isRequired,
    onEditStart: PropTypes.func.isRequired,
    onEditEnd: PropTypes.func.isRequired,
}

Sidebar.defaultProps = {
    description: 'New Item',
    notes: '',
}

export default Sidebar
