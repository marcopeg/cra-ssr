/*
    eslint
        react/prefer-stateless-function: off,
        no-unused-expressions: off,
        react/sort-comp: off,
*//* global localStorage document */

import React from 'react'
import Nestable from 'react-nestable'

import tree2array from './tree2array'
import tree2object from './tree2object'
import EstimateItem from './EstimateItem'

class Estimate extends React.Component {
    state = {
        items: [],
        flatItems: [],
        flatItemsMap: {},
        collapsedItems: [],
        details: {},
        activeItem: null,
        isEditMode: false,
    }

    componentWillMount () {
        this.loadItems()
        setInterval(() => this.saveItems(), 1000)
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
                case ' ': {
                    if (!this.state.isEditMode && this.state.activeItem) {
                        const node = this.state.flatItemsMap[this.state.activeItem]
                        if (this.hasChildren(this.state.activeItem)) {
                            this.toggleCollapse(node)
                        } else {
                            this.toggleStatus(node)
                        }
                    }
                    break
                }
                case '+': {
                    if (!this.state.isEditMode) {
                        this.addNewItem()
                    }
                    break
                }
                default: {
                    console.log(evt.key) // eslint-disable-line
                } // eslint-disable-line
            }
        }, false)

        // init collapsed documents
        setTimeout(() => this.nestable.collapse(this.state.collapsedItems))
    }

    onTreeChange = (items) => {
        this.setState({
            items,
            flatItems: tree2array(items),
            flatItemsMap: tree2object(items),
        })
        setTimeout(() => this.saveItems())
    }

    saveItems = () => {
        const {
            items,
            details,
            activeItem,
            collapsedItems,
        } = this.state

        localStorage.setItem('estimate-doc', JSON.stringify({
            items,
            details,
            activeItem,
            collapsedItems,
        }))
    }

    loadItems = () => {
        try {
            const doc = JSON.parse(localStorage.getItem('estimate-doc'))
            if (doc) {
                const {
                    items,
                    details,
                    activeItem,
                    collapsedItems,
                } = doc

                this.setState({
                    items,
                    flatItems: tree2array(items),
                    flatItemsMap: tree2object(items),
                    details,
                    activeItem,
                    collapsedItems,
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
            flatItemsMap: tree2object(items),
            details: {
                ...this.state.details,
                [id]: {
                    status: false,
                    description: 'new item',
                    estimate: 0,
                },
            },
        })

        // edit item
        this.selectItem(id)
        this.setState({ isEditMode: true })
    }

    selectItem = (activeItem) => {
        this.setState({ activeItem })
    }

    updateItem = (itemId, details) => {
        this.setState({
            details: {
                ...this.state.details,
                [itemId]: details,
            },
        })
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

    hasChildren = (nodeId) => {
        const node = this.state.flatItemsMap[nodeId]
        if (!node.item.children) {
            return false
        }
        return node.item.children.length > 0
    }

    toggleCollapse = (node) => {
        const collapsedItems = [ ...this.state.collapsedItems ]
        const index = this.state.collapsedItems.indexOf(node.id)
        if (index === -1) {
            collapsedItems.push(node.id)
        } else {
            collapsedItems.splice(index, 1)
        }
        this.setState({ collapsedItems })
        this.nestable.collapse(collapsedItems)
    }

    toggleStatus = (node) => {
        const details = this.state.details[node.id]
        this.setState({
            details: {
                ...this.state.details,
                [node.id]: {
                    ...details,
                    status: details.status ? false : true, // eslint-disable-line
                },
            },
        })
    }

    getEstimate = (nodeId) => {
        if (this.hasChildren(nodeId)) {
            return this.state.flatItemsMap[nodeId].item.children
                .reduce((acc, children) => acc + this.getEstimate(children.id), 0)
        }

        if (this.state.details[nodeId].status) {
            return 0
        }

        return parseInt(this.state.details[nodeId].estimate, 10) || 0
    }

    renderItem = ({ item }) => (
        <EstimateItem
            id={item.id}
            details={this.state.details[item.id]}
            isActive={item.id === this.state.activeItem}
            isEditable={this.state.isEditMode}
            isLeafNode={!this.hasChildren(item.id)}
            estimate={this.getEstimate(item.id)}
            isCollapsed={this.state.collapsedItems.indexOf(item.id) !== -1}
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
                    ref={(nestable) => { this.nestable = nestable }}
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
