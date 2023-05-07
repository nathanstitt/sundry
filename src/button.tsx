import { React, PropsWithOptionalChildren, CSSObject, styled, cx } from './common.js'
import { BSVariants, bsClassNames } from './bs.js'
import { Popover, PopoverProps, Tooltip, TooltipProps } from './popover.js'
import { LoadingDots as LD } from './loading-dots.js'
import { IconKey, Icon } from './icon.js'
import { usePendingState } from './pending.js'
import { themeMedia as media } from './theme.js'

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
        return iconOnly ? { ...baseStyle, ...iconStyle } : baseStyle
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
    tooltip?: React.ReactNode
    tooltipProps?: Omit<TooltipProps, 'children' | 'target' | 'popover'>
    popover?: React.ReactNode
    popoverProps?: Omit<PopoverProps, 'children' | 'target' | 'popover'>
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
            tooltip,
            tooltipProps = {},
            popover,
            popoverProps = {},
            ...otherProps
        } = forwardedProps

        let { icon } = otherProps

        const [bsClasses, props] = bsClassNames('btn', otherProps, { default: 'light' })

        let content = <></>

        if (typeof icon === 'string') {
            icon = <Icon icon={icon as IconKey} />
        }

        if (icon) content = <>{content}{icon}</>

        const isBusy = usePendingState(busyProp, 150)

        if (!icon || iconOnly !== true) {
            const message = isBusy ? (
                <Busy>
                    {busyMessage}
                    <LD />
                </Busy>
            ) : (
                children
            )

            content = <>{content}<span>{message}</span></>
        }

        if (tooltip) {
            content = (
                <Tooltip tooltip={tooltip} {...tooltipProps}>
                    {content}
                </Tooltip>
            )
        }

        if (popover) {
            content = (
                <Popover popover={popover} {...popoverProps}>
                    {content}
                </Popover>
            )
        }

        return (
            <StyledButton
                type={type}
                ref={ref}
                disabled={busyProp || disabled}
                rowReverse={!!reverse}
                iconOnly={icon && iconOnly === true}
                className={cx(
                    'btn',
                    bsClasses,
                    align ? `justify-content-${align}` : '',
                    {
                        clear,
                        active,
                        'btn-sm': small,
                        'btn-lg': large,
                    },
                    className
                )}
                {...props}
            >
                {content}
            </StyledButton>
        )
    }
)

Button.displayName = 'Button'
