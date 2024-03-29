import { useMemo } from './common.js'
import { isDate } from './util.js'
import { toDateTime } from './date.js'
import { useFormContext, useFormState } from './form-hooks.js'

export const useDateTimeField = (name: string, rangeNames?: [string, string]) => {
    const { getFieldState, getValues, watch, isReadOnly } = useFormContext()

    const fieldNames = useMemo<string[]>(
        () => (Array.isArray(rangeNames) ? rangeNames : [name]),
        [rangeNames, name]
    )
    const formState = useFormState(fieldNames as any)

    for (const fn of fieldNames) {
        watch(fn)
    }

    const values = fieldNames
        .map((fn) => {
            const v = getValues(fn)
            return isDate(v) ? v : v ? toDateTime(v) : undefined
        })
        .filter(Boolean) as Date[]

    const fields =  fieldNames.map((fn) => getFieldState(fn, formState)).filter(Boolean)

    return { fields, fieldNames, values, isReadOnly }
}
