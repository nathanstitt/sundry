import { React, FCWC, cx } from './common'
import styled from '@emotion/styled'
import { BoxProps } from 'boxible'
import { Col, ColProps } from './col'
import { ExtraInfo } from './label'
import { FieldState } from './form'

export interface FloatingFieldProps extends BoxProps, ColProps {
    id: string
    label: React.ReactNode
    name?: string
    feedback?: string
    hint?: React.ReactNode
    className?: string
    wrapperClassName?: string
    reversed?: boolean
    addOnControls?: React.ReactNode
    fieldState?: FieldState
    loadOptions?: any
    marginBottom?: boolean | number
}

const Wrapper = styled(Col)({})

const Body = styled.div({
    flex: 1,
    position: 'relative',
    '.form-control[readonly]': {
        backgroundColor: 'white',
    },
})

export const FloatingField: FCWC<FloatingFieldProps> = ({
    id,
    reversed,
    hint,
    fieldState,
    label,
    children,
    className,
    marginBottom,
    wrapperClassName,
    addOnControls,
    loadOptions,
    ...props
}) => {
    let body = (
        <Body className={className}>
            {children}
            {label}
            <ExtraInfo>
                {hint && <span className="hint">{hint}</span>}
                {fieldState?.error && <span className="invalid">{fieldState?.error.message}</span>}
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
            {...props}
        >
            {body}
        </Wrapper>
    )
}
