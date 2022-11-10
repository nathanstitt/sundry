import { useMemo } from './common'
import { isDate, compact } from './util'
import { toDateTime } from './date'
import { useFormContext, FieldWithState } from './form'

export const useDateTimeField = (name: string, rangeNames?: [string, string]) => {
    const { getField, getValues, watch } = useFormContext()

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
        () => compact<FieldWithState>(fieldNames.map(getField)),
        [fieldNames, getField]
    )

    return { fields, fieldNames, values }
}
