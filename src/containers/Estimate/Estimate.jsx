/*
    eslint
        react/prefer-stateless-function: off,
        no-unused-expressions: off,
*//* global localStorage document */

import React from 'react'
import Nestable from 'react-nestable'

import tree2array from './tree2array'
import EstimateItem from './EstimateItem'

class Estimate extends React.Component {
    state = {
        items: [],
        details: {},
        activeItem: null,
        isEditMode: false,
    }

    componentWillMount () {
        this.loadItems()
    }

    componentDidMount () {
        document.addEventListener('keyup', (evt) => {
            switch (evt.key) {
                case 'ArrowUp': {
                    if (this.state.isEditMode === false) {
                        this.movePrev()
                        evt.preventDefault()
                    }
                    break
                }
                case 'ArrowDown': {
                    if (this.state.isEditMode === false) {
                        this.moveNext()
                        evt.preventDefault()
                    }
                    break
                }
                case 'Enter': {
                    if (this.state.isEditMode === false && this.state.activeItem !== null) {
                        this.setState({ isEditMode: true })
                    } else {
                        console.log('should save changes')
                        this.setState({ isEditMode: false })
                    }
                    break
                }
                case 'Escape': {
                    if (this.state.isEditMode) {
                        console.log('should discard changes')
                        this.setState({ isEditMode: false })
                    }
                    break
                }
                default: {
                    console.log(evt.key)
                } // eslint-disable-line
            }
        }, false)
    }

    onTreeChange = (items) => {
        this.setState({
            items,
            flatItems: tree2array(items),
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
                this.setState({
                    items,
                    flatItems: tree2array(items),
                    details,
                })
            }
        } catch (err) {
            // eslint-disable-next-line
            alert('It was not possible to load items')
        }
    }

    addNewItem = () => {
        const id = Date.now()
        const items = [
            ...this.state.items,
            { id },
        ]
        this.setState({
            items,
            flatItems: tree2array(items),
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

    moveNext = () => {
        const index = this.state.flatItems.indexOf(this.state.activeItem)
        if (index === -1) {
            this.selectItem(this.state.flatItems[0])
        } else if (this.state.flatItems[index + 1]) {
            this.selectItem(this.state.flatItems[index + 1])
        }
    }

    movePrev = () => {
        const index = this.state.flatItems.indexOf(this.state.activeItem)
        if (index === -1) {
            this.selectItem(this.state.flatItems[this.state.flatItems.lengt - 1])
        } else if (this.state.flatItems[index - 1]) {
            this.selectItem(this.state.flatItems[index - 1])
        }
    }

    renderItem = ({ item }) => (
        <EstimateItem
            id={item.id}
            details={this.state.details[item.id]}
            isActive={item.id === this.state.activeItem}
            isEditable={this.state.isEditMode}
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
                    onChange={this.onTreeChange}
                />
                <hr />
                <button onClick={this.addNewItem}>Add Item</button>
            </div>
        )
    }
}

export default Estimate
