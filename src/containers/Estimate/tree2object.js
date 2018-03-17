/* eslint-disable */

const tree2objectsList = (tree, depth = 0) =>
    tree
        .map(item => (
            item.children
                ? [ { id: item.id, depth: depth, item }, ...tree2objectsList(item.children, depth + 1) ]
                : [{ id: item.id, depth: depth, item }]
        ))
        .reduce((acc, val) => [...acc, ...val], [])

const tree2object = (tree) =>
    tree2objectsList(tree, 0)
        .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})

export default tree2object
