/*
    eslint
        react/prefer-stateless-function: off,
*//* global localStorage */

import React from 'react'
import Nestable from 'react-nestable'

import EstimateItem from './EstimateItem'

class Estimate extends React.Component {
    state = {
        items: [],
        details: {},
        activeItem: null,
    }

    componentWillMount () {
        this.loadItems()
    }

    onItemsChange = (items) => {
        this.setState({
            items,
        })
        setTimeout(() => this.saveItems())
    }

    saveItems = () => {
        localStorage.setItem('estimate-items', JSON.stringify(this.state.items))
        localStorage.setItem('estimate-details', JSON.stringify(this.state.details))
    }

    loadItems = () => {
        try {
            const items = JSON.parse(localStorage.getItem('estimate-items'))
            const details = JSON.parse(localStorage.getItem('estimate-details'))
            if (items && details) {
                this.setState({ items, details })
            }
        } catch (err) {
            // eslint-disable-next-line
            alert('It was not possible to load items')
        }
    }

    addNewItem = () => {
        const id = Date.now()
        this.setState({
            items: [
                ...this.state.items,
                { id },
            ],
            details: {
                ...this.state.details,
                [id]: {
                    description: 'new item',
                },
            },
        })

        setTimeout(() => this.saveItems())
    }

    selectItem = activeItem =>
        this.setState({ activeItem })

    updateItem = (itemId, details) => {
        this.setState({
            details: {
                ...this.state.details,
                [itemId]: details,
            },
        })

        setTimeout(() => this.saveItems())
    }

    renderItem = ({ item }) => (
        <EstimateItem
            id={item.id}
            details={this.state.details[item.id]}
            isActive={item.id === this.state.activeItem}
            onFocus={this.selectItem}
            onChange={this.updateItem}
        />
    )

    render () {
        const { items } = this.state
        return (
            <div style={{ textAlign: 'left', margin: 20 }}>
                <h1>Estimate Tool</h1>
                <Nestable
                    items={items}
                    renderItem={this.renderItem}
                    onChange={this.onItemsChange}
                />
                <hr />
                <button onClick={this.addNewItem}>Add Item</button>
            </div>
        )
    }
}

export default Estimate
