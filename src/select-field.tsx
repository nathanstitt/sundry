import { React, useId, styled, useState, cx } from './common.js'
import { useField } from './form-hooks.js'
import { FloatingFieldProps, FloatingField } from './floating-field.js'
import { FloatingLabel } from './label.js'
import { Select, SelectOption, SelectProps } from './select.js'
import type { SelectOnChangeHandler } from './select.js'

export interface SelectFieldProps<O extends SelectOption = SelectOption>
    extends SelectProps<O>,
        Omit<FloatingFieldProps, 'name' | 'id' | 'loadOptions' | 'label'> {
    id?: string
    name: string
    readOnly?: boolean
    display?: string
    label?: string
}

export const SelectWrapper = styled(FloatingField)({
    display: 'flex',
    minHeight: 60,
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

export function SelectField<O extends SelectOption = SelectOption>({
    name,
    id: providedId,
    label,
    isDisabled,
    placeholder = '',
    isMulti,
    cacheOptions,
    readOnly: propsReadonly,
    isClearable,
    menuPlacement,
    noOptionsMessage,
    onChange: propsOnChange,
    options = [],
    className,
    theme: _,
    allowCreate,
    value,
    onCreateOption,
    ...props
}: SelectFieldProps<O>) {
    const autoId = useId()
    const id = providedId || autoId

    const { field, isReadOnly, fieldState } = useField(name)

    const [isFocused, setFocusState] = useState(false)

    const hasError = Boolean(field && fieldState.error)

    const v = field.value || value
    const hasValue = Array.isArray(v) ? v.length > 0 : !!v
    const readOnly = propsReadonly == null ? isReadOnly : propsReadonly
    const onFocus = React.useCallback(() => {
        setFocusState(true)
    }, [setFocusState])
    const onBlur = React.useCallback(() => {
        setFocusState(false)
        field.onBlur()
    }, [field, setFocusState])
    const onChange: SelectOnChangeHandler = React.useCallback(
        (value, option, meta) => {
            field.onChange({ target: { ...field, value } })
            propsOnChange?.(value, option, meta)
        },
        [field, propsOnChange]
    )

    const select = (
        <Select
            {...props}
            cacheOptions={cacheOptions}
            innerRef={field.ref}
            value={v}
            inputId={id}
            name={name}
            onCreateOption={onCreateOption}
            allowCreate={allowCreate}
            isDisabled={isDisabled || readOnly}
            isMulti={isMulti}
            noOptionsMessage={noOptionsMessage}
            isClearable={isClearable}
            menuPlacement={menuPlacement}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            className={cx('select-field', { 'is-invalid': hasError })}
            onChange={onChange}
            options={options}
        />
    )

    if (!label) {
        return select
    }

    const labelEl = (
        <FloatingLabel
            htmlFor={id}
            displayHigh={!!isMulti}
            isRaised={!!placeholder || hasValue || isFocused || readOnly}
        >
            {label}
        </FloatingLabel>
    )

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
            {select}
        </SelectWrapper>
    )
}
