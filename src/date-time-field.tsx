import { React, styled, useId, useMemo, useState, useCallback, cx } from './common.js'
import { Box } from 'boxible'
import { DateTime, DateTimeProps, DateTimeApiInstance } from './date-time.js'
import { FloatingField, FloatingFieldProps } from './floating-field.js'
import { FloatingLabel } from './label.js'
import { Icon } from './icon.js'
import { useDateTimeField } from './date-time-hook.js'
import { omitColSizeProps } from './col.js'

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
    label,
    withTime,
    name,
    readOnly,
    rangeNames,
    ...props
}) => {
    const flatPickrRef = React.useRef<DateTimeApiInstance>(null)
    const autoId = useId()
    const id = providedId || autoId

    const { fields, values } = useDateTimeField(name, rangeNames)

    const [isFocused, setFocused] = useState(false)
    const onClear = useCallback(() => flatPickrRef.current?.clear() , [flatPickrRef])

    const hasValue = useMemo(() => !!values.find(Boolean), [values])
    const hasError = useMemo(() => !!fields.find((f) => f.error), [fields])
    const onOpen = useCallback(() => setFocused(true), [setFocused])
    const onClose = useCallback(() => setFocused(false), [setFocused])

    return (
        <Wrapper
            {...props}
            name={name}
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
        >
            <div className="controls">
                <Box flex>
                    <DateTime
                        id={id}
                        apiRef={flatPickrRef}
                        name={name}
                        onOpen={onOpen}
                        onClose={onClose}
                        readOnly={readOnly}
                        withTime={withTime}
                        rangeNames={rangeNames}
                        data-enable-time={withTime}
                        {...omitColSizeProps(props)}
                    />
                </Box>
                {hasValue && !readOnly && (
                    <Icon
                        onClick={onClear}
                        data-testid="clear-dates"
                        icon="cancel"
                        color="#cbcccb"
                    />
                )}
            </div>
        </Wrapper>
    )
}
