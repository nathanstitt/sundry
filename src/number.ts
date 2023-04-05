export function roundToPrecision(num: number, precision = 2) {
    const pow = Math.pow(10, precision)
    return Math.round(num * pow) / pow
}
