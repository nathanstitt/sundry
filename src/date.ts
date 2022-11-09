import { dayjs } from './dayjs'
import { OpUnitType } from 'dayjs'
import { isDate, isString, isNumber, isNil } from './common'

export type DateTimeInputs = Date | string | number | dayjs.Dayjs

export function formatHoursDuration(hours?: number, empty: any = ''): string {
    if (hours == null) {
        return empty
    }
    const negative = hours < 0
    const posHours = Math.abs(hours)
    const h = String(Math.round(60 * (posHours % 1)))
    return `${negative ? '-' : ''}${Math.floor(posHours)}:${h.padStart(2, '0')}`
}

export const toDayJS = (dateThing: DateTimeInputs): dayjs.Dayjs => {
    if (dayjs.isDayjs(dateThing)) {
        return dateThing
    } else if (isDate(dateThing)) {
        return dayjs(dateThing)
    } else if (isString(dateThing)) {
        return dayjs(dateThing)
    } else if (isNumber(dateThing)) {
        return dayjs.unix(dateThing)
    } else {
        return dayjs(null)
    }
}

export const isMidnight = (dateThing: DateTimeInputs): boolean => {
    const dt = toDayJS(dateThing)
    return dt.minute() === 0 && dt.hour() === 0
}

export const toDateTime = (dateThing: DateTimeInputs): Date => {
    return toDayJS(dateThing).toDate()
}

export const formatDate = (dateThing?: DateTimeInputs | null, format = 'll'): string | null => {
    if (!dateThing) return null
    return toDayJS(dateThing).format(format)
}

export const distance = (
    fromDateThing: DateTimeInputs,
    toDateThing: DateTimeInputs,
    unit: OpUnitType,
    float?: boolean
) => {
    return toDayJS(fromDateThing).diff(toDayJS(toDateThing), unit, float)
}

export const distanceToNow = (dateThing: DateTimeInputs, unit: OpUnitType, float?: boolean) => {
    return toDayJS(dateThing).diff(dayjs(), unit, float)
}

export const isInPast = (dateThing: DateTimeInputs, unit: OpUnitType = 'millisecond') => {
    return distanceToNow(dateThing, unit) < 0
}

export const hourMinFromNow = (dateThing: DateTimeInputs) => {
    return formatHoursDuration(distanceToNow(dateThing, 'hours', true) * -1)
}

export const humanizedDuration = (
    from: DateTimeInputs,
    to: DateTimeInputs = dayjs(),
    withoutSuffix = false
) => {
    return toDayJS(from).from(toDayJS(to), withoutSuffix)
}

export const durationToDecimal = (t: string) => {
    const arr = t.split(':').map((n) => parseInt(n, 10))
    const dec = Math.round((arr[1] / 6) * 10)
    return parseFloat(arr[0] + '.' + (dec < 10 ? '0' : '') + dec)
}

export const nowDayOnly = () => dayjs().format('YYYY-MM-DD')
export const toDayOnly = (dateThing?: DateTimeInputs) =>
    toDayJS(dateThing || '').format('YYYY-MM-DD')
export const convertPropertyToDayOnly = (obj: any, property: string) => {
    if (isNil(obj[property])) return obj[property]
    return (obj[property] = dayjs(obj[property]).format('YYYY-MM-DD'))
}

export function toIsoStr(dateThing: DateTimeInputs) {
    return toDayJS(dateThing).toISOString()
}
