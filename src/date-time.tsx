import { React, useId, useState, useEffect, useCallback, cx } from './common'
import FlatPickr from 'flatpickr'
import { Box } from 'boxible'
import { rangePlugin } from './flatpickr-range-plugin'
import { useFormContext } from './form'
import { useDateTimeField } from './date-time-hook'

export interface DateTimeProps {
    id?: string
    format?: string
    readOnly?: boolean
    options?: FlatPickr.Options.Options

    onOpen?: FlatPickr.Options.Hook
    onClose?: FlatPickr.Options.Hook
    onChange?: FlatPickr.Options.Hook

    rangeNames?: [string, string]
    withTime?: boolean
    name: string
    className?: string
    innerRef?: React.Ref<HTMLInputElement>
    align?: 'center' | 'end' | 'start' | 'baseline' | 'stretch'
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
    format = withTime ? DateTimeFormats.shortDateTime : DateTimeFormats.shortDate,
    readOnly: propsReadonly,
    rangeNames,
    onOpen: onOpenProp,
    onClose: onCloseProp,
    onChange: onChangeProp,
    options = {},
    ...domProps
}) => {
    const { control, setValue: setFieldValue, getField, isReadOnly } = useFormContext()

    const readOnly = propsReadonly == null ? isReadOnly : propsReadonly
    const autoId = useId()
    const id = providedId || autoId
    const [flatpickrEl, setFlatpickrEl] = useState<HTMLInputElement | null>(null)
    const [endRangePickrEl, setEndRangePickrEl] = useState<HTMLInputElement | null>(null)
    const [flatpickr, setFlatpickr] = useState<FlatPickr.Instance | null>(null)

    const { fieldNames, values } = useDateTimeField(name, rangeNames)

    const onChange = useCallback(
        (newDates: Date[], a: any, b: any, c: any) => {
            for (let i = 0; i < fieldNames.length; i++) {
                if (newDates[i] && newDates[i].getTime() !== values[i]?.getTime()) {
                    setFieldValue(fieldNames[i], newDates[i])
                }
            }
            onChangeProp?.(newDates, a, b, c)
        },
        [fieldNames, setFieldValue, onChangeProp, values]
    )

    const onClose = useCallback(
        (newDates: Date[], a: any, b: any, c: any) => {
            let wasChanged = false
            for (let i = 0; i < fieldNames.length; i++) {
                if (newDates[i] && newDates[i].getTime() !== values[i]?.getTime()) {
                    setFieldValue(fieldNames[i], newDates[i])
                    wasChanged = true
                }
                getField(fieldNames[i])?.onBlur?.({ target: { name: fieldNames[i] } })
            }
            if (wasChanged) onChangeProp?.(newDates, a, b, c)
            onCloseProp?.(newDates, a, b, c)
        },
        [fieldNames, setFieldValue, getField, onCloseProp, onChangeProp, values]
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

            if (!values.length) {
                flatpickr.clear()
            } else {
                if (
                    values.find((dt, i) => dt?.getTime() !== flatpickr.selectedDates[i]?.getTime())
                ) {
                    flatpickr.setDate(values, true)
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
            fieldNames.forEach((fldName) => {
                control.register(fldName)
            })
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
        endRangePickrEl,
        values,
    ])

    useEffect(() => {
        return () => {
            fieldNames.forEach((fldName) => {
                control.unregister(fldName)
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
