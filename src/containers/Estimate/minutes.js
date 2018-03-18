
const wday = 60 * 6

const minutes = (value) => {
    if (value >= wday) {
        const days = Math.floor(value / wday)
        const hours = Math.floor((value - (days * wday)) / 60)
        return `${days}d ${hours}h`
    }

    if (value >= 60) {
        const hours = Math.floor(value / 60)
        const min = value - (hours * 60)
        return `${hours}h ${min}m`
    }

    return `${value} minutes`
}

export default minutes
