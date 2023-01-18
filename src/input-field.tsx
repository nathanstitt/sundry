import { React, useMemo, cx, useId } from './common'
import styled from '@emotion/styled'
import { FloatingField, FloatingFieldProps } from './floating-field'
import { useField } from './form'
import { useCallback } from 'react'
import { useForkRef } from 'rooks'

const inputFieldToggleStyle = {
    padding: 0,
    width: '25px',
    height: '25px',
    margin: '0 5px 0 0',
}
export const InputFieldCheckbox = styled.input(inputFieldToggleStyle)
export const InputFieldRadio = styled.input(inputFieldToggleStyle)
export const InputFieldTextarea = styled.textarea(({ height = '110' }: any) => ({
    '&.form-control': { minHeight: `${height}px` },
}))
const INPUTS = {
    checkbox: InputFieldCheckbox,
    radio: InputFieldRadio,
    textarea: InputFieldTextarea,
}

export const CheckboxFieldWrapper = styled(FloatingField)({
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: '0.375rem 0.75rem', // styles mimic form-control
    color: '#212529',
    overflow: 'hidden',
    border: '1px solid #ced4da',
    borderRadius: '0.25rem',
    label: {
        flex: 1,
    },
})

const Label = styled.label({
    paddingTop: 0,
    paddingBottom: 0,
})

export interface InputProps
    extends Omit<
            React.HTMLProps<HTMLInputElement>,
            'name' | 'height' | 'width' | 'wrap' | 'label' | 'onResize' | 'onResizeCapture'
        >,
        Omit<FloatingFieldProps, 'label' | 'id'> {
    name: string
    type?:
        | 'checkbox'
        | 'radio'
        | 'textarea'
        | 'text'
        | 'password'
        | 'email'
        | 'number'
        | 'tel'
        | 'url'
    autoComplete?: string
    readOnly?: boolean
    onBlur?: any
    autoFocus?: boolean
    rows?: number
    label?: React.ReactNode
    id?: string
}

export const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    (forwardedProps, forwardedRef) => {
        const {
            label,
            name,
            className,
            id: providedId,
            onBlur: propsOnBlur,
            readOnly: propsReadonly,
            type = 'text',
            onChange: onChangeProp,
            ...props
        } = forwardedProps
        const autoId = useId()
        const id = providedId || autoId
        const { field, fieldState, isReadOnly } = useField(name)

        const InputComponent: any = (INPUTS as any)[type] || 'input'
        const ref = useForkRef(field.ref, forwardedRef)

        const isCheckLike = type === 'radio' || type === 'checkbox'
        const Wrapper = isCheckLike ? CheckboxFieldWrapper : FloatingField
        const labelEl = <Label htmlFor={id}>{label}</Label>
        const readOnly = propsReadonly == null ? isReadOnly : propsReadonly
        const onBlur = useMemo(
            () => (e: React.FocusEvent<HTMLInputElement>) => {
                field.onBlur()
                propsOnBlur && propsOnBlur(e)
            },
            [field, propsOnBlur]
        )
        const onChange = useCallback(
            (ev: React.ChangeEvent<HTMLInputElement>) => {
                field.onChange(ev)
                onChangeProp?.(ev)
            },
            [onChangeProp, field]
        )

        let checked: boolean | undefined = undefined
        if (type === 'radio') {
            checked = field.value === props.value
        } else if (type === 'checkbox') {
            checked = !!field.value
        }
        const input = (
            <InputComponent
                {...field}
                {...props}
                value={props.value || field.value || ''}
                id={id}
                ref={ref}
                checked={checked}
                onChange={onChange}
                disabled={readOnly}
                onBlur={onBlur}
                readOnly={readOnly}
                placeholder={label == null ? 'placeholder' : label}
                type={type}
                className={cx({
                    'form-control': !isCheckLike,
                    'form-check-input': isCheckLike,
                    'is-invalid': !!fieldState.error,
                })}
            />
        )
        if (!label) {
            return input
        }
        return (
            <Wrapper
                id={id}
                name={name}
                label={labelEl}
                {...props}
                className={cx(className, {
                    'form-control': isCheckLike,
                    'form-floating': !isCheckLike,
                })}
            >
                {input}
            </Wrapper>
        )
    }
)

InputField.displayName = 'InputField'
