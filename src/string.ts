import { isString } from './util.js'

export function toSentence(arry: string | string[], join = '&') {
    if (isString(arry)) {
        arry = arry.split(' ')
    }
    if (arry.length > 1) {
        return `${arry.slice(0, arry.length - 1).join(', ')} ${join} ${arry.slice(-1)}`
    } else {
        return arry[0]
    }
}

export const titleize = (input: string) => {
    return input
        .toLowerCase()
        .replace('_', ' ')
        .replace(/(?:^|\s|-)\S/g, (x) => x.toUpperCase())
}

export function centerEllipsis(str: string, limit = 30) {
    if (str.length > limit) {
        const cutoff = limit / 2 - 2
        return str.substring(0, cutoff) + '…' + str.substring(str.length - cutoff)
    }
    return str
}

export const fileExt = (fn: string) => {
    const indx = fn.lastIndexOf('.')
    if (indx === -1) return null
    return fn.substring(indx + 1, fn.length)
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const randomString = (len = 12) => {
    let result = ''
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.random() * characters.length)
    }
    return result
}

export const extractSurroundingWords = (word: string, text: string) => {
    // eslint-disable-next-line no-useless-escape
    const wordSurround = new RegExp(`((?:[^\s]+\s?){0,3}${word}(?:\s?[^\s]+){0,4})`, 'im')
    const match = text.match(wordSurround)
    return match ? match[0] : null
}
