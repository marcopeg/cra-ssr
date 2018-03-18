/* eslint-disable */

const tree2objectsList = (tree, parents = []) =>
    tree
        .map(item => (
            item.children
                ? [ { id: item.id, depth: parents.length, item, parents, }, ...tree2objectsList(item.children, [ ...parents, item ]) ]
                : [{ id: item.id, depth: parents.length, item, parents, }]
        ))
        .reduce((acc, val) => [...acc, ...val], [])

const tree2object = (tree) =>
    tree2objectsList(tree, 0)
        .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})

export default tree2object
