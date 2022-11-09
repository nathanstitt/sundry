import { css, cx, React, PropsWithOptionalChildren } from './common'
import styled from '@emotion/styled'
import { keyframes, CSSObject } from '@emotion/react'
import { Popover, Tooltip } from './popover'
import { Icon as IconifyIconComponent } from '@iconify/react'
import type { IconifyIcon } from '@iconify/react'
import { ICON_DEFINITIONS } from './packaged-icons'

const spinKeyframes = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`

const spinCSS = css`
    animation: 2s linear ${spinKeyframes} infinite;
`

export interface IconifyIconDefinition {
    body: string
}
export { IconifyIcon, ICON_DEFINITIONS as SUNDRY_PACKAGED_ICONS }
export type IconKey = keyof typeof ICON_DEFINITIONS
export type IconSpec = IconKey | IconifyIconDefinition | IconifyIcon
export interface IconProps extends Omit<IconifyIcon, 'icon' | 'body' | 'height' | 'width'> {
    icon: IconSpec
    title?: string
    color?: string
    className?: string
    busy?: boolean
    tooltip?: React.ReactNode
    popover?: React.ReactNode
    buttonStyles?: CSSObject
    width?: number | string
    height?: number | string
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void
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
            buttonStyles = {},
            ...iconProps
        } = props

        const icon = busy ? 'spin' : iconProp
        let iconEl = (
            <IconifyIconComponent
                ref={ref || undefined}
                icon={typeof icon === 'object' ? icon : ICON_DEFINITIONS[icon]}
                className={cx(className, icon === 'spin' ? spinCSS : '')}
                {...iconProps}
            />
        )
        if (tooltip) {
            iconEl = <Tooltip tooltip={tooltip}>{iconEl}</Tooltip>
        }
        if (popover) {
            iconEl = <Popover popover={popover}>{iconEl}</Popover>
        }

        if (onClick) {
            return (
                <IconBtn onClick={onClick} disabled={busy} className={css(buttonStyles)}>
                    {iconEl}
                    {children}
                </IconBtn>
            )
        }
        return iconEl
    }
)

Icon.displayName = 'Icon'
