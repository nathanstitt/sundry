import { React, FCWC, styled, cx } from './common'
import { BoxProps } from 'boxible'
import { Col, ColProps } from './col'
import { ExtraInfo } from './label'
import { useFieldState } from './form-hooks'

export interface FloatingFieldProps extends BoxProps, ColProps {
    id: string
    label: React.ReactNode
    name: string
    feedback?: string
    hint?: React.ReactNode
    className?: string
    wrapperClassName?: string
    reversed?: boolean
    addOnControls?: React.ReactNode
    loadOptions?: any
    error?: { message?: string }
    marginBottom?: boolean | number
}

const Wrapper = styled(Col)({})

const Body = styled.div({
    flex: 1,
    position: 'relative',
    '.form-control[readonly]': {
        backgroundColor: 'inherit',
    },
})

export const FloatingField: FCWC<FloatingFieldProps> = ({
    id: _,
    reversed: __,
    loadOptions: ___,
    hint,
    label,
    children,
    className,
    marginBottom,
    wrapperClassName,
    addOnControls,
    error: propsError,
    name,
    ...props
}) => {
    const fieldState = useFieldState(name)
    const error = propsError || fieldState?.error
    let body = (
        <Body className={cx(className, { 'is-invalid': !!error })}>
            {children}
            {label}
            <ExtraInfo>
                {hint && <span className="hint">{hint}</span>}
                {error && <span className="invalid">{error.message}</span>}
            </ExtraInfo>
        </Body>
    )
    if (addOnControls) {
        body = (
            <div className="input-group">
                {body}
                {addOnControls}
            </div>
        )
    }
    return (
        <Wrapper
            className={cx('field-wrapper', wrapperClassName, {
                [`mb-${marginBottom || 2}`]: marginBottom !== false,
            })}
            data-field-name={name}
            {...props}
        >
            {body}
        </Wrapper>
    )
}
