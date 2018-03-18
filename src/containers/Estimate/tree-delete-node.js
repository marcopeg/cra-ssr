/*
    eslint
        no-param-reassign: off
*/

const treeDeleteNode = (tree = [], nodeId) =>
    tree.filter((node) => {
        if (node.id === nodeId) {
            return false
        }

        if (node.children) {
            node.children = treeDeleteNode(node.children, nodeId)
        }

        return true
    })

export default treeDeleteNode
