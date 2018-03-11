/*
    eslint
        global-require: off,
        import/prefer-default-export: off,
        no-restricted-syntax: off,
        no-await-in-loop: off,
*/

const services = [
    require('./location-service'),
    // require('./products-service'),
    // require('./clock-service'),
]

export const configServices = async (store) => {
    let service
    for (service of services) {
        if (service.init) {
            await service.init()(store.dispatch, store.getState)
        }
    }
    for (service of services) {
        if (service.start) {
            await service.start()(store.dispatch, store.getState)
        }
    }
}
