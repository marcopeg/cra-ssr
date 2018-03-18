
const wday = 60 * 6

const minutes = (value) => {
    if (value >= wday) {
        const days = Math.floor(value / wday)
        const hours = Math.floor((value - (days * wday)) / 60)
        return hours
            ? `${days}d ${hours}h`
            : `${days}d`
    }

    if (value >= 60) {
        const hours = Math.floor(value / 60)
        const min = value - (hours * 60)
        return min
            ? `${hours}h ${min}m`
            : `${hours}h`
    }

    return `${value} minutes`
}

export default minutes
