export function roundToPrecision(num: number, precision = 2) {
    const pow = Math.pow(10, precision)
    return Math.round(num * pow) / pow
}

export function ordinal(n: number) {
    if (n % 10 == 1 && n % 100 != 11) {
        return 'st'
    }
    if (n % 10 == 2 && n % 100 != 12) {
        return 'nd'
    }
    if (n % 10 == 3 && n % 100 != 13) {
        return 'rd'
    }
    return 'th'
}
