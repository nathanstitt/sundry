import { React, useId, useState, useEffect, useCallback, cx } from './common.js'
import FlatPickr from 'flatpickr'
import { Box } from 'boxible'
import { rangePlugin } from './flatpickr-range-plugin.js'
import { useFormContext, RegisteredField } from './form-hooks.js'
import { useDateTimeField } from './date-time-hook.js'
import { setRef } from './hooks.js'

type DateTimeApiInstance = FlatPickr.Instance

export type { DateTimeApiInstance }

export interface DateTimeProps {
    id?: string
    format?: string
    readOnly?: boolean
    options?: FlatPickr.Options.Options
    placeholder?: string

    onOpen?: FlatPickr.Options.Hook
    onClose?: FlatPickr.Options.Hook
    onChange?: FlatPickr.Options.Hook

    rangeNames?: [string, string]
    withTime?: boolean
    name: string
    className?: string
    align?: 'center' | 'end' | 'start' | 'baseline' | 'stretch'
    apiRef?: React.Ref<FlatPickr.Instance | null>
}

export const DateTimeFormats = {
    shortDate: 'M j, Y',
    shortDateTime: 'M j, Y h:i K',
}

export const DateTime: React.FC<DateTimeProps> = ({
    id: providedId,
    name,
    className,
    withTime,
    apiRef,
    format = withTime ? DateTimeFormats.shortDateTime : DateTimeFormats.shortDate,
    readOnly: propsReadonly,
    rangeNames,
    onOpen: onOpenProp,
    onClose: onCloseProp,
    onChange: onChangeProp,
    options = {},
    ...domProps
}) => {
    const { control, setValue: setFieldValue, isReadOnly } = useFormContext()
    const [fields, setFields] = useState<RegisteredField[]>([])

    const readOnly = propsReadonly == null ? isReadOnly : propsReadonly

    const autoId = useId()
    const id = providedId || autoId
    const [flatpickrEl, setFlatpickrEl] = useState<HTMLInputElement | null>(null)
    const [endRangePickrEl, setEndRangePickrEl] = useState<HTMLInputElement | null>(null)
    const [flatpickr, _setFlatpickr] = useState<FlatPickr.Instance | null>(null)
    const setFlatpickr = useCallback((fp: FlatPickr.Instance) => {
        _setFlatpickr(fp)
        setRef(apiRef, fp)
    },[_setFlatpickr, apiRef])
    const { fieldNames, values } = useDateTimeField(name, rangeNames)

    const onChange = useCallback(
        (newDates: Date[], value: any, fltpkr: FlatPickr.Instance, data: any) => {
            for (let i = 0; i < fieldNames.length; i++) {
                if ( newDates[i]?.getTime() !== values[i]?.getTime()) {
                    setFieldValue(fieldNames[i], newDates[i] || null, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
                }
            }
            if (endRangePickrEl && newDates.length < 2) {
                endRangePickrEl.value = ''
            }
            onChangeProp?.(newDates, value, fltpkr, data)
        },
        [fieldNames, setFieldValue, onChangeProp, values, endRangePickrEl]
    )

    const onClose = useCallback(
        (newDates: Date[], a: any, b: any, c: any) => {
            let wasChanged = false
            for (let i = 0; i < fieldNames.length; i++) {
                const f = fields[i]
                const ev = { target: { name: fieldNames[i], value: newDates[i] } }
                if (newDates[i] && newDates[i].getTime() !== values[i]?.getTime()) {
                    f.onChange(ev)
                    wasChanged = true
                }
                f.onBlur(ev)
            }
            if (wasChanged) onChangeProp?.(newDates, a, b, c)
            onCloseProp?.(newDates, a, b, c)
        },
        [fieldNames, fields, onCloseProp, onChangeProp, values]
    )

    useEffect(() => {
        if (!flatpickrEl) return

        const newOptions = {
            ...options,
            dateFormat: format,
            enableTime: withTime,
        }

        if (flatpickr) {
            flatpickr.set(newOptions)
            flatpickr.set('onChange', onChange)
            flatpickr.set('onClose', onClose)
            flatpickr.set('onOpen', onOpenProp)
            flatpickr.set('clickOpens', !readOnly)

            if (!values.length) {
                flatpickr.clear()
            } else {
                if (
                    values.find((dt, i) => dt?.getTime() !== flatpickr.selectedDates[i]?.getTime())
                ) {
                    flatpickr.setDate(values)
                }
            }
        } else {
            const f = FlatPickr(flatpickrEl, {
                defaultDate: values,
                disableMobile: true,
                clickOpens: !readOnly,
                mode: rangeNames ? 'range' : 'single',
                plugins: endRangePickrEl ? [rangePlugin({ input: endRangePickrEl })] : [],
                ...newOptions,
                onChange: onChange,
                onClose,
                onOpen: onOpenProp,
            })
            setFlatpickr(f)
            setFields(fieldNames.map((fldName) => control.register(fldName)))
        }
    }, [
        flatpickrEl,
        fieldNames,
        rangeNames,
        readOnly,
        withTime,
        flatpickr,
        format,
        options,
        onClose,
        control,
        onOpenProp,
        onChange,
        setFlatpickr,
        endRangePickrEl,
        values,
    ])

    useEffect(() => {
        return () => {
            fieldNames.forEach((fldName) => {
                control.unregister(fldName, { keepValue: true, keepDefaultValue: true })
            })
        }
    }, [fieldNames, control])

    return (
        <Box align="baseline" gap flex>
            <input
                {...domProps}
                id={id}
                disabled={readOnly}
                ref={setFlatpickrEl}
                className={cx('form-control', 'flatpickr-input', className)}
                readOnly
                type="text"
            />
            {fieldNames.length > 1 && (
                <input
                    id={`${id}-2nd`}
                    disabled={readOnly}
                    ref={setEndRangePickrEl}
                    className={cx('form-control', 'flatpickr-input', className)}
                    readOnly
                    type="text"
                />
            )}
        </Box>
    )
}
