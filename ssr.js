/*
    eslint
        import/no-extraneous-dependencies: off
*/

// ES6 Compatibility (for client-side code)
require('ignore-styles')
require('babel-register')({
    ignore: /\/(build|node_modules)\//,
    presets: [ 'env', 'react-app' ],
    plugins: [
        [ 'module-resolver', { root: [ './src' ] }],
    ],
})

const express = require('express')
const winston = require('winston')
const bodyParser = require('body-parser')
const compression = require('compression')
const env = require('node-env-file')
const path = require('path')
const fs = require('fs')
const { Helmet } = require('react-helmet')
const { staticRender } = require('./src/index.ssr')

env(path.join(__dirname, '.env'))

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
    data = data.replace('<html lang="en">', `<html ${html}>`)
    data = data.replace('</head>', `${head}</head>`)
    data = data.replace('</head>', `<script>window.REDUX_INITIAL_STATE = ${JSON.stringify(state)};</script></head>`)
    data = data.replace('<div id="root"></div>', `<div id="root">${body}</div>`)

    // Use bundles from development website (experimental)
    if (process.env.NODE_ENV === 'development' && process.env.SSR_USE_DYNAMIC_JS === 'yes') {
        data = data.replace(/<link href="\/static\/css\/main.([^\s]*).css" rel="stylesheet">/g, '')
        data = data.replace(/\/static\/js\/main.([^\s]*).js/g, '//localhost:3000/static/js/bundle.js')
    }

    // remove bundle js (dev, experimental)
    if (process.env.SSR_DISABLE_JS === 'yes') {
        data = data.replace(/<script type="text\/javascript" src="\/static\/js\/main.([^\s]*).js"><\/script>/g, '')
    }

    return data
}

const ssr = async (req, res) => {
    try {
        const filePath = path.resolve(__dirname, './build/index.html')
        const htmlTemplate = await readFile(filePath)
        const initialState = {}
        const prerender = await staticRender(req.url, initialState, 3000)
        const helmet = Helmet.renderStatic()

        res.send(prepHTML(htmlTemplate, {
            html: helmet.htmlAttributes.toString(),
            head: [
                helmet.title.toString(),
                helmet.meta.toString(),
                helmet.link.toString(),
            ].join(''),
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