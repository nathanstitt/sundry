import { useMemo } from './common'
import { isDate } from './util'
import { toDateTime } from './date'
import { useFormContext } from './form-hooks'

export const useDateTimeField = (name: string, rangeNames?: [string, string]) => {
    const { getFieldState, getValues, watch } = useFormContext()

    const fieldNames = useMemo<string[]>(
        () => (Array.isArray(rangeNames) ? rangeNames : [name]),
        [rangeNames, name]
    )

    for (const fn of fieldNames) {
        watch(fn)
    }

    const values = fieldNames
        .map((fn) => {
            const v = getValues(fn)
            return isDate(v) ? v : v ? toDateTime(v) : undefined
        })
        .filter(Boolean) as Date[]

    const fields = useMemo(
        () => fieldNames.map((fn) => getFieldState(fn)),
        [fieldNames, getFieldState]
    ).filter(Boolean)

    return { fields, fieldNames, values }
}
