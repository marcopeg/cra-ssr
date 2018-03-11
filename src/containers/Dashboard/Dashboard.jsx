import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const state2props = ({ app }) => ({
    title: app.name,
})

const Dashboard = ({ title }) => (
    <div>
        <h1>Dashboard - { title }</h1>
    </div>
)

Dashboard.propTypes = {
    title: PropTypes.string.isRequired,
}


export default connect(state2props)(Dashboard)
