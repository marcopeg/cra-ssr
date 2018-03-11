
import logger from 'lib/logger'
import Route from 'route-parser'

const createHistoryRouter = (routesDef) => {

    const routes = routesDef.map(route => ({
        ...route,
        test: new Route(route.path),
    }))

    return location => (dispatch) => {
        if (!location) {
            return
        }

        const { pathname } = location

        try {
            const { action, match } = routes
                .map(route => ({
                    ...route,
                    match: route.test.match(pathname),
                }))
                .filter(route => route.match)
                .shift()

            if (action) {
                dispatch(action(match))
                dispatch({
                    type: '@@route::fired',
                    payload: {
                        ...location,
                        params: match,
                    },
                })
            }
        } catch (e) {
            logger.verbose('Path handler not found for:', pathname)
        }
    }
}

export default createHistoryRouter
