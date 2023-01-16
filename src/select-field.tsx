import { React, useId, useState, cx, FC } from './common'
import styled from '@emotion/styled'
import { useField } from './form'
import { FloatingFieldProps, FloatingField } from './floating-field'
import { FloatingLabel } from './label'
import { Select, SelectOption, SelectProps, SelectValue } from './select'

export interface SelectFieldProps
    extends SelectProps,
        Omit<FloatingFieldProps, 'name' | 'id' | 'loadOptions'> {
    id?: string
    name: string
    readOnly?: boolean
    display?: string
    innerRef?: any
}

export const SelectWrapper = styled(FloatingField)({
    display: 'flex',
    height: 60,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column-reverse',
    '.select-field > *': {
        border: 0,
        '> *': {
            paddingLeft: 0,
        },
    },
    '&.is-invalid': {
        backgroundPosition: 'right 0.5rem top 0.5rem',
        paddingRight: 'inherit',
    },
    '.xtra': {
        flexDirection: 'row',
        paddingTop: 5,
        height: 'initial',
        '.invalid': {
            margin: '0 20px 0 5px',
        },
    },
})

export const SelectField: FC<SelectFieldProps> = ({
    name,
    id: providedId,
    innerRef,
    label,
    isMulti,
    cacheOptions,
    readOnly: propsReadonly,
    isClearable,
    menuPlacement,
    noOptionsMessage,
    onChange: propsOnChange,
    options = [],
    className,
    theme,
    allowCreate,
    value,
    onCreateOption,
    ...props
}) => {
    const autoId = useId()
    const id = providedId || autoId

    const { field, isReadOnly, fieldState } = useField(name)

    const [isFocused, setFocusState] = useState(false)

    const hasError = Boolean(field && fieldState.error)

    const v = field.value || value
    const hasValue = Array.isArray(v) ? v.length > 0 : !!v
    const readOnly = propsReadonly == null ? isReadOnly : propsReadonly
    const onFocus = () => {
        setFocusState(true)
    }
    const onBlur = () => {
        setFocusState(false)
        field.onBlur()
    }
    const labelEl = (
        <FloatingLabel
            htmlFor={id}
            displayHigh={!!isMulti}
            isRaised={hasValue || isFocused || readOnly}
        >
            {label}
        </FloatingLabel>
    )
    const onChange = (value: SelectValue, option: SelectOption, meta: any) => {
        field.onChange({ target: { ...field, value } })
        propsOnChange?.(value, option, meta)
    }

    return (
        <SelectWrapper
            {...props}
            id={id}
            name={name}
            label={labelEl}
            className={cx('form-control', className, {
                valued: hasValue,
                'is-invalid': hasError,
            })}
        >
            <Select
                {...props}
                cacheOptions={cacheOptions}
                innerRef={field.ref}
                value={v}
                inputId={id}
                name={name}
                onCreateOption={onCreateOption}
                allowCreate={allowCreate}
                isDisabled={readOnly}
                isMulti={isMulti}
                noOptionsMessage={noOptionsMessage}
                isClearable={isClearable}
                menuPlacement={menuPlacement}
                placeholder={<span />}
                onFocus={onFocus}
                onBlur={onBlur}
                className={cx('select-field', { 'is-invalid': hasError })}
                onChange={onChange}
                options={options}
            />
        </SelectWrapper>
    )
}
