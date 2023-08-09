import { css, cx, styled, React, PropsWithOptionalChildren } from './common.js'
import { keyframes, CSSObject } from '@emotion/react'
import { Popover, PopoverProps, Tooltip, TooltipProps } from './popover.js'
import { Icon as IconifyIconComponent } from '@iconify/react'
import type { IconifyIcon } from '@iconify/react'
import { ICON_DEFINITIONS, setSundryIcons } from './packaged-icons.js'

const spinKeyframes = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`

const spinCSS = css({
    animation: `${spinKeyframes} 2s linear infinite`,
})

export interface IconifyIconDefinition {
    body: string
}
export { IconifyIcon, ICON_DEFINITIONS as SUNDRY_PACKAGED_ICONS, setSundryIcons }
export type IconKey = keyof typeof ICON_DEFINITIONS
export type IconSpec = IconKey | IconifyIconDefinition | IconifyIcon
export interface IconProps extends Omit<IconifyIcon, 'icon' | 'body' | 'height' | 'width'> {
    icon: IconSpec
    title?: string
    iconName?: string
    color?: string
    className?: string
    busy?: boolean
    tooltip?: React.ReactNode
    tooltipProps?: Omit<TooltipProps, 'children' | 'target' | 'popover'>
    popover?: React.ReactNode
    popoverProps?: Omit<PopoverProps, 'children' | 'target' | 'popover'>
    buttonStyles?: CSSObject
    width?: number | string
    buttonType?: 'button' | 'submit' | 'reset'
    height?: number | string
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
    ['data-testid']?: string
}

const IconBtn = styled.button({
    border: 'none',
    padding: 0,
    margin: 0,
    background: 'transparent',
    color: '#738694',
    transition: 'all 0.3s ease-out',
    ':hover': {
        color: '#292929',
    },
})
export const Icon = React.forwardRef<SVGSVGElement, PropsWithOptionalChildren<IconProps>>(
    (props, ref) => {
        const {
            icon: iconProp,
            tooltip,
            popover,
            onClick,
            children,
            busy,
            className,
            iconName,
            tooltipProps = {},
            popoverProps = {},
            'data-testid': dti,
            buttonType = 'button',
            buttonStyles = {},
            ...iconProps
        } = props

        const icon = busy ? 'spin' : iconProp
        let content = (
            <IconifyIconComponent
                data-icon-name={iconName}
                ref={ref || undefined}
                data-testid={onClick ? undefined : dti}
                icon={typeof icon === 'object' ? icon : ICON_DEFINITIONS[icon]}
                className={cx(className, icon === 'spin' ? spinCSS : '')}
                {...iconProps}
            />
        )

        if (onClick) {
            content = (
                <IconBtn
                    data-button-icon={iconName}
                    data-testid={dti}
                    type={buttonType}
                    disabled={busy}
                    onClick={onClick}
                    className={css(buttonStyles)}
                >
                    {content}
                    {children}
                </IconBtn>
            )
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

        return content
    }
)

Icon.displayName = 'Icon'
