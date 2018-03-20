/* global localStorage window document */

import downloadJson from './download-json'
import uploadJson from './upload-json'

export const hipenize = str => str.replace(/ +/g, '-').toLowerCase()

export const getStorageName = ctx => hipenize(ctx.state.title)

const getLocalStorageName = ctx => (
    ctx.props.match.params.projectId
        ? `estimate-${ctx.props.match.params.projectId}`
        : 'estimate-default'
)

export const saveToBrowser = (ctx) => {
    const {
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    } = ctx.state

    localStorage.setItem(getLocalStorageName(ctx), JSON.stringify({
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    }))
}

export const loadFromBrowser = (ctx) => {
    try {
        const doc = JSON.parse(localStorage.getItem(getLocalStorageName(ctx)))
        if (doc) {
            const {
                title,
                items,
                details,
                activeItem,
                collapsedItems,
            } = doc

            ctx.updateStateWithItems(items, {
                title: title || 'A new project', // backward compatibility
                details,
                activeItem,
                collapsedItems,
            })
        } else {
            // eslint-disable-next-line
            console.error('It was not possible to load items')
        }
    } catch (err) {
        // eslint-disable-next-line
        console.error('It was not possible to load items')
    }
}

export const updateProjectUrl = (ctx) => {
    setTimeout(() => {
        saveToBrowser(ctx)
        setTimeout(() => {
            const baseUrl = window.location.href.split('/#/')[0]
            window.location.href = `${baseUrl}/#/estimate/${getStorageName(ctx)}`
        })
    })
}

export const saveToDisk = (ctx) => {
    const {
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    } = ctx.state
    saveToBrowser(ctx)

    downloadJson({
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    }, getStorageName(ctx))
}

export const loadFromDisk = (ctx) => {
    uploadJson()
        .then((doc) => {
            const {
                title,
                items,
                details,
                activeItem,
                collapsedItems,
            } = doc

            ctx.updateStateWithItems(items, {
                title: title || 'A new project', // backward compatibility
                details,
                activeItem,
                collapsedItems,
            })

            updateProjectUrl(ctx)
        })
        .catch((err) => {
            alert('Errors loading the file') // eslint-disable-line
            console.error(err) // eslint-disable-line
        })
}

const str2csv = str => [
    '"',
    str.replace(/"/g, '""'),
    '"',
].join('')

export const exportCsv = (ctx) => {
    const rows = ctx.state.flatItems.map(id => [
        id,
        ctx.state.flatItemsMap[id].depth.toString(),
        (
            (
                ctx.state.flatItemsMap[id].item.children
                && ctx.state.flatItemsMap[id].item.children.length
            )
                ? '-'
                : ctx.state.details[id].estimate.toString()
        ),
        str2csv(ctx.state.details[id].description),
        str2csv(ctx.state.details[id].notes || ''),
    ].join(','))

    const csv = [
        [ 'id', 'level', 'estimate', 'subject', 'notes' ].join(','),
        ...rows,
    ].join('\n')

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv) // eslint-disable-line
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', getStorageName(ctx) + '.csv') // eslint-disable-line
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}
