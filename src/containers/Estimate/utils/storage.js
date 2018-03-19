/* global localStorage */

import downloadJson from './download-json'
import uploadJson from './upload-json'

export const saveToBrowser = (ctx) => {
    const {
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    } = ctx.state

    localStorage.setItem('estimate-doc', JSON.stringify({
        title,
        items,
        details,
        activeItem,
        collapsedItems,
    }))
}

export const loadFromBrowser = (ctx) => {
    try {
        const doc = JSON.parse(localStorage.getItem('estimate-doc'))
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
    }, 'estimate-project')
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
        })
        .catch((err) => {
            alert('Errors loading the file') // eslint-disable-line
            console.error(err) // eslint-disable-line
        })
}