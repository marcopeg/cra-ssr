/*
    eslint
        import/no-extraneous-dependencies: off
*/

// ES6 Compatibility (for client-side code)
require('ignore-styles')
require('babel-register')({
    ignore: /\/(build|node_modules)\//,
    presets: ['env', 'react-app'],
    plugins: [
        ['module-resolver', { root: ['./src'] }],
    ],
})

const express = require('express')
const winston = require('winston')
const bodyParser = require('body-parser')
const compression = require('compression')
const path = require('path')
const fs = require('fs')
const { staticRender } = require('./src/index.ssr')

winston.level = 'verbose'
const PORT = process.env.PORT || 8080

// setup express
const app = express()
app.use(compression())
app.use(bodyParser.json())

const readFile = (filePath, encoding = 'utf8') => new Promise((resolve, reject) => {
    try {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(data)
        })
    } catch (err) {
        reject(err)
    }
})

const prepHTML = (template, {
    html,
    head,
    body,
    state,
}) => {
    let data = template
    data = data.replace('<html lang="en">', `<html ${html}`)
    data = data.replace('</head>', `${head}</head>`)
    data = data.replace('</head>', `<script>window.REDUX_INITIAL_STATE = ${JSON.stringify(state)};</script></head>`)
    data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

    // if (process.env.NODE_ENV === 'development') {
    //     data = data.replace(/<link href="\/static\/css\/main.([^\s]*).css" rel="stylesheet">/g, '')
        // data = data.replace(/\/static\/js\/main.([^\s]*).js/g, '//localhost:3000/static/js/bundle.js')
    // }

    // data = data.replace(/\/static\/js\/main.([^\s]*).js/g, '//nothing.js')

    return data
}

const ssr = async (req, res) => {
    try {
        const filePath = path.resolve(__dirname, './build/index.html')
        const htmlTemplate = await readFile(filePath)
        const prerender = await staticRender(req.url)
        res.send(prepHTML(htmlTemplate, {
            html: '>',
            head: '',
            body: prerender.html,
            state: prerender.initialState,
        }))
    } catch (err) {
        res.status(500).send(err.message)
    }
}

app.get('/', ssr)
app.use(express.static(path.resolve(__dirname, './build')))
app.get('*', ssr)

app.listen(PORT, () => winston.info(`[ssr] server running on ${PORT}`))

/*


staticRender('/products/1555')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
*/