/*
    eslint
        import/prefer-default-export: off
*/

const createContext = () => {
    return {
        reducers: {
            ssr: () => ({
                await: f => {
                    console.log('server')
                    return f
                },
            })
        }
    }
}

export default createContext
