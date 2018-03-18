/*
    eslint
        react/prefer-stateless-function: off,
        no-unused-expressions: off,
        react/sort-comp: off,
        no-restricted-syntax: off,
*//* global localStorage document */

import React from 'react'
import Nestable from 'react-nestable'

import tree2array from './tree2array'
import tree2object from './tree2object'
import treeDeleteNode from './tree-delete-node'
import downloadJson from './download-json'
import uploadJson from './upload-json'
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
        focusOn: 'description',
    }

    componentWillMount () {
        setTimeout(this.loadItems)
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
                        this.setState({
                            isEditMode: true,
                            focusOn: 'description',
                        })
                    } else {
                        this.moveNext()
                    }
                    break
                }
                case 'e': {
                    if (this.state.isEditMode === false && this.state.activeItem !== null) {
                        this.setState({
                            isEditMode: true,
                            focusOn: 'estimate',
                        })
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
                case 'Backspace': {
                    if (!this.state.isEditMode) {
                        this.deleteItem()
                    }
                    break
                }
                case 'd': {
                    if (!this.state.isEditMode) {
                        console.log(this.state) // eslint-disable-line
                    }
                    break
                }
                case 's': {
                    if (!this.state.isEditMode) {
                        const {
                            items,
                            details,
                            activeItem,
                            collapsedItems,
                        } = this.state
                        this.saveItems()

                        downloadJson({
                            items,
                            details,
                            activeItem,
                            collapsedItems,
                        }, 'estimate-project')
                    }
                    break
                }
                case 'o': {
                    if (!this.state.isEditMode) {
                        uploadJson()
                            .then((doc) => {
                                const {
                                    items,
                                    details,
                                    activeItem,
                                    collapsedItems,
                                } = doc

                                this.updateStateWithItems(items, {
                                    details,
                                    activeItem,
                                    collapsedItems,
                                })
                            })
                            .catch((err) => {
                                alert('Errors loading the file') // eslint-disable-line
                                console.error(err) // eslint-disable-line
                            })
                    }
                    break
                }
                case 'r': {
                    if (!this.state.isEditMode) {
                        this.updateStateWithItems([], {
                            collapsedItems: [],
                            details: {},
                            activeItem: null,
                            isEditMode: false,
                        })
                    }
                    break
                }
                default: {
                    // console.log(evt.key) // eslint-disable-line
                } // eslint-disable-line
            }
        }, false)

        // init collapsed documents
        setTimeout(() => this.nestable.collapse(this.state.collapsedItems))
    }

    updateStateWithItems = (items, state = {}) => this.setState({
        ...state,
        items,
        flatItems: tree2array(items),
        flatItemsMap: tree2object(items),
    })

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

                this.updateStateWithItems(items, {
                    details,
                    activeItem,
                    collapsedItems,
                })
            } else {
                console.error('It was not possible to load items')
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
        this.updateStateWithItems(items, {
            activeItem: id,
            isEditMode: true,
            details: {
                ...this.state.details,
                [id]: {
                    status: false,
                    description: 'new item',
                    estimate: 0,
                },
            },
        })
    }

    deleteItem = () => {
        // eslint-disable-next-line
        if (!confirm('remove it all?')) {
            return
        }

        const {
            details,
            flatItemsMap,
            activeItem,
            collapsedItems,
        } = this.state

        const node = flatItemsMap[activeItem]
        const subtree = tree2array(node.item.children)

        // remove from tree
        const items = treeDeleteNode(this.state.items, this.state.activeItem)
        delete details[node.id]

        for (const nodeId of subtree) {
            delete details[nodeId]
            const idx = collapsedItems.indexOf(nodeId)
            if (idx !== -1) {
                collapsedItems.splice(idx, 1)
            }
        }

        this.updateStateWithItems(items, {
            details,
            collapsedItems,
        })
    }

    hasChildren = (nodeId) => {
        const node = this.state.flatItemsMap[nodeId]
        if (!node.item.children) {
            return false
        }
        return node.item.children.length > 0
    }

    // define if it is inside a collapsed cone
    isVisible = (nodeId) => {
        const node = this.state.flatItemsMap[nodeId]
        if (!node) {
            return false
        }

        if (!node.parents) {
            return true
        }

        for (const parent of node.parents) {
            if (this.state.collapsedItems.indexOf(parent.id) !== -1) {
                return false
            }
        }

        return true
    }

    selectItem = (activeItem) => {
        this.setState({ activeItem })
    }

    updateItemDetails = (itemId, details) => {
        this.setState({
            details: {
                ...this.state.details,
                [itemId]: details,
            },
        })
    }

    moveNext = () => {
        const { flatItems } = this.state
        let index = flatItems.indexOf(this.state.activeItem)
        let nextIndex = null
        let loopGuard = 0

        if (index === -1) {
            nextIndex = flatItems[0] // eslint-disable-line
        } else if (flatItems[index + 1]) {
            nextIndex = flatItems[index + 1]
        }

        while (loopGuard < 100 && this.isVisible(nextIndex) !== true) {
            index = flatItems.indexOf(nextIndex)
            if (index === -1) {
                nextIndex = flatItems[0] // eslint-disable-line
            } else if (flatItems[index + 1]) {
                nextIndex = flatItems[index + 1]
            }
            loopGuard += 1
        }

        this.selectItem(nextIndex)
    }

    movePrev = () => {
        const { flatItems, activeItem } = this.state
        let nextIndex = null
        let loopGuard = 0
        let index = flatItems.indexOf(activeItem)

        if (index === -1) {
            nextIndex = flatItems[flatItems.length - 1] // eslint-disable-line
        } else if (flatItems[index - 1]) {
            nextIndex = flatItems[index - 1]
        }

        while (loopGuard < 100 && this.isVisible(nextIndex) !== true) {
            index = flatItems.indexOf(nextIndex)
            if (index === -1) {
                nextIndex = flatItems[flatItems.length - 1] // eslint-disable-line
            } else if (flatItems[index - 1]) {
                nextIndex = flatItems[index - 1]
            }
            loopGuard += 1
        }

        this.selectItem(nextIndex)
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
            focusOn={this.state.focusOn}
            estimate={this.getEstimate(item.id)}
            isCollapsed={this.state.collapsedItems.indexOf(item.id) !== -1}
            onFocus={this.selectItem}
            onChange={this.updateItemDetails}
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
                    onChange={this.updateStateWithItems}
                />
                <hr />
                <button onClick={this.addNewItem}>Add Item</button>
            </div>
        )
    }
}

export default Estimate
