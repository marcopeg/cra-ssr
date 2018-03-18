/* eslint-disable */

const tree2array = (tree = [], key = 'id') => {
    return tree
        .map(item => (
            item.children
                ? [ item.id, ...tree2array(item.children) ]
                : [item.id]
        ))
        .reduce((acc, val) => [...acc, ...val], [])
}

export default tree2array
