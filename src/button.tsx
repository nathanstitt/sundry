import { React, PropsWithOptionalChildren, cx } from './common'
import styled, { CSSObject } from '@emotion/styled'
import { merge } from 'lodash-es'

//import type { CSSObject } from '@emotion/react'
import { BSVariants, bsClassNames } from './bs'
import LD from './loading-dots'
import { IconKey, Icon } from './icon'
import { usePendingState } from './pending'
import { media } from './theme'

const iconStyle = {
    display: 'flex',
    padding: 0,
    backgroundColor: 'transparent',
    border: 'none',
    svg: {
        marginRight: 0,
        ':not([height])': {
            height: '18px',
        },
    },
}

const StyledButton = styled.button<{ iconOnly: boolean; rowReverse: boolean }>(
    ({ iconOnly, rowReverse }) => {
        const baseStyle: CSSObject = {
            display: 'flex',
            alignItems: 'center',
            flexDirection: (rowReverse ? 'row-reverse' : 'row') as any,
            gap: iconOnly ? 0 : '0.5rem',
            [media.mobile]: {
                gap: '0.2rem',
            },
            svg: {
                transition: 'color 0.2s',
                color: 'currentColor',
                ':not([height])': {
                    height: '18px',
                },
            },
            '&.clear': {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
            },
        }
        return iconOnly ? merge(baseStyle, iconStyle) : baseStyle
    }
)

const Busy = styled.span({
    display: 'flex',
})

type IconT = React.ReactNode | IconKey

export interface ButtonProps extends BSVariants, React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
    icon?: IconT
    type?: 'button' | 'submit' | 'reset'
    align?: 'start' | 'center' | 'end'
    disabled?: boolean
    busy?: boolean
    busyMessage?: string
    className?: string
    clear?: boolean
    small?: boolean
    large?: boolean
    iconOnly?: boolean
    active?: boolean
    reverse?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, PropsWithOptionalChildren<ButtonProps>>(
    (forwardedProps, ref) => {
        const {
            disabled,
            busyMessage,
            children,
            clear,
            small,
            large,
            type = 'button',
            busy: busyProp = false,
            className = '',
            align,
            iconOnly = !children,
            active,
            reverse,
            ...otherProps
        } = forwardedProps

        let { icon } = otherProps

        const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })

        if (typeof icon === 'string') {
            icon = <Icon icon={icon as IconKey} />
        }
        const isBusy = usePendingState(busyProp, 150)

        let message = isBusy ? (
            <Busy>
                {busyMessage}
                <LD />
            </Busy>
        ) : (
            children
        )
        if (icon) {
            message = <span>{message}</span>
        }

        return (
            <StyledButton
                type={type}
                ref={ref}
                disabled={busyProp || disabled}
                rowReverse={!!reverse}
                iconOnly={icon && !message}
                className={cx(
                    'btn',
                    className,
                    bsClasses,
                    align ? `justify-content-${align}` : '',
                    {
                        clear,
                        active,
                        'btn-sm': small,
                        'btn-lg': large,
                    }
                )}
                {...props}
            >
                {icon}
                {iconOnly !== true && message}
            </StyledButton>
        )
    }
)

Button.displayName = 'Button'
