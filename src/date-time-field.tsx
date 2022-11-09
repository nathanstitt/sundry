import { React, useId, useMemo, useState, useCallback, compact, cx } from './common'
// import { compact } from './util'
import { Box } from 'boxible'
import styled from '@emotion/styled'
import { DateTime, DateTimeProps } from './date-time'
import { useFormContext, FieldWithState } from './form'
import { FloatingField, FloatingFieldProps } from './floating-field'
import { FloatingLabel } from './label'
import { Icon } from './icon'

interface DateTimeFieldFieldProps
    extends DateTimeProps,
        Omit<FloatingFieldProps, 'id' | 'name' | 'align'> {}

const Wrapper = styled(FloatingField)({
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column',
    '.controls': {
        display: 'flex',
        '.form-control': {
            padding: 0,
            display: 'flex',
        },
    },
    '.flatpickr-input': {
        height: 'calc(3.5rem + 2px)',

        border: 0,
        flex: 1,
        '&:focus': {
            outline: 'none',
        },
        '&[readonly]': {
            cursor: 'default',
        },
    },
    '&.valued': {
        '.flatpickr-input': {
            paddingTop: '1.625rem',
            paddingBottom: '0.625rem',
        },
    },
})

export const DateTimeField: React.FC<DateTimeFieldFieldProps> = ({
    id: providedId,
    innerRef,
    label,
    withTime,
    name,
    readOnly,
    rangeNames,
    ...props
}) => {
    const { setValue, getField } = useFormContext()

    const autoId = useId()
    const id = providedId || autoId

    const fieldNames = useMemo<string[]>(
        () => (rangeNames ? rangeNames : [name]),
        [rangeNames, name]
    )

    const [isFocused, setFocused] = useState(false)
    const onClear = useCallback(() => {
        fieldNames.forEach((fn) => setValue(fn, null))
    }, [fieldNames, setValue])

    const fields = useMemo(
        () => compact<FieldWithState>(fieldNames.map(getField)),
        [fieldNames, getField]
    )
    const hasValue = useMemo(() => !!fields.find((f) => f.value), [fields])
    const hasError = useMemo(() => !!fields.find((f) => f.state.error), [fields])

    const onOpen = useCallback(() => setFocused(true), [setFocused])
    const onClose = useCallback(() => setFocused(false), [setFocused])

    return (
        <Wrapper
            data-field-name={name}
            label={
                <FloatingLabel htmlFor={id} isRaised={hasValue || isFocused || readOnly}>
                    {label}
                </FloatingLabel>
            }
            className={cx('form-control', {
                valued: hasValue,
                'is-invalid': hasError,
            })}
            id={id}
            fieldState={fields[0]?.state}
        >
            <div className="controls">
                <Box flex>
                    <DateTime
                        id={id}
                        name={name}
                        onOpen={onOpen}
                        onClose={onClose}
                        readOnly={readOnly}
                        withTime={withTime}
                        rangeNames={rangeNames}
                        data-enable-time={withTime}
                        {...props}
                    />
                </Box>
                {hasValue && !readOnly && <Icon onClick={onClear} icon="cancel" color="#cbcccb" />}
            </div>
        </Wrapper>
    )
}
