/*
    eslint
        react/prefer-stateless-function: off,
        no-unused-expressions: off,
        react/sort-comp: off,
        no-restricted-syntax: off,
*//* global document */

import React from 'react'
import Nestable from 'react-nestable'

import { loadFromBrowser, saveToBrowser, saveToDisk, loadFromDisk } from './utils/storage'
import tree2array from './utils/tree2array'
import tree2object from './utils/tree2object'
import treeDeleteNode from './utils/tree-delete-node'
import EstimateItem from './EstimateItem'
import ProjectTitle from './ProjectTitle'

const styles = {}
styles.basics = {
    textAlign: 'left',
    margin: 20,
    fontFamily: 'verdana',
}
styles.welcome = {
    border: '1px solid #47bde8',
    background: '#afe4ff',
    borderRadius: 4,
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
}
styles.shortcuts = {
    background: '#ddd',
    padding: 20,
}
styles.header = {
    borderBottom: '2px solid black',
    marginBottom: 10,
    paddingBottom: 10,
}

class Estimate extends React.Component {
    state = {
        title: 'A new project...',
        items: [],
        flatItems: [],
        flatItemsMap: {},
        collapsedItems: [],
        details: {},
        activeItem: null,
        isEditMode: false,
        focusOn: 'description',
        keyboardEvents: true,
    }

    componentWillMount () {
        setTimeout(() => loadFromBrowser(this))
        setInterval(() => saveToBrowser(this), 1000)
    }

    componentDidMount () {
        document.addEventListener('keyup', (evt) => {
            if (this.state.keyboardEvents !== true) {
                return
            }

            switch (evt.key) {
                case 'ArrowUp': {
                    this.movePrev()
                    evt.preventDefault()
                    break
                }
                case 'ArrowDown': {
                    this.moveNext()
                    evt.preventDefault()
                    break
                }
                case 'Enter': {
                    if (evt.altKey || evt.ctrlKey) {
                        this.addNewItem()
                    } else if (this.state.isEditMode === false && this.state.activeItem !== null) {
                        this.setState({
                            isEditMode: true,
                            focusOn: 'description',
                        })
                    } else if (this.state.isEditMode === true) {
                        this.setState({
                            isEditMode: false,
                        })
                    } else {
                        this.addNewItem()
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
                        this.setState({ isEditMode: false })
                    } else if (this.state.activeItem !== null) {
                        this.selectItem(null)
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
                case '+':
                case 'a': {
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
                        saveToDisk(this)
                    }
                    break
                }
                case 'o': {
                    if (!this.state.isEditMode) {
                        loadFromDisk(this)
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

    keyboardOff = () => this.setState({
        keyboardEvents: false,
    })

    keyboardOn = () => this.setState({
        keyboardEvents: true,
    })

    updateStateWithItems = (items, state = {}) => this.setState({
        ...state,
        items,
        flatItems: tree2array(items),
        flatItemsMap: tree2object(items),
    })

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
            onToggleCollapse={() => this.toggleCollapse(item)}
            onToggleStatus={() => this.toggleStatus(item)}
        />
    )

    render () {
        const { items } = this.state
        return (
            <div style={styles.basics}>
                <div style={styles.header}>
                    <ProjectTitle
                        value={this.state.title}
                        onEditStart={this.keyboardOff}
                        onEditEnd={this.keyboardOn}
                        onChange={title => this.setState({ title })}
                    />
                </div>
                {items.length ? null : (
                    <div style={styles.welcome}>
                        <p>Welcome to a new experience in discovering your requirements!</p>
                        <p>Click "Add Item" (or just type "a") to add your first requirement.</p>
                    </div>
                )}
                <Nestable
                    ref={(nestable) => { this.nestable = nestable }}
                    items={items}
                    renderItem={this.renderItem}
                    onChange={this.updateStateWithItems}
                />
                <hr />
                <button onClick={this.addNewItem}>+ Add Item</button>
                <button onClick={() => saveToDisk(this)}>Save Project</button>
                <button onClick={() => loadFromDisk(this)}>Open Project</button>
                <hr />
                <div>
                    <h3>Keyboard Shortcuts:</h3>
                    <pre style={styles.shortcuts}>
                        "a", "+", "alt + Enter" -> Add new requirement<br />
                        "Enter" -> activate / deactivate edit mode<br />
                        "e" -> enter editing mode and focus on the estimate field<br />
                        "Space" -> collapse sections or mark a requirement as done<br />
                        "s" -> save project to disk<br />
                        "o" -> open a saved project<br />
                    </pre>
                </div>
            </div>
        )
    }
}

export default Estimate
