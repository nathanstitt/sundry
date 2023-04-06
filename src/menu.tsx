import { React, FCWC, cx, useId } from './common.js'
import type {
    UseDropdownMenuOptions,
    DropdownMenuProps as RUDdMProps,
    DropdownToggleProps,
    DropdownProps as RUDdProps,
} from '@restart/ui/Dropdown'

import { createPortal } from 'react-dom'
import { asyncComponentLoader } from './async-load.js'
import { Button, ButtonProps } from './button.js'

const Toggle = asyncComponentLoader<DropdownToggleProps>(() =>
    import('@restart/ui/Dropdown').then((m) => m.default.Toggle)
)
const Menu = asyncComponentLoader<RUDdMProps>(() =>
    import('@restart/ui/Dropdown').then((m) => m.default.Menu)
)

const Dropdown = asyncComponentLoader<RUDdProps>(() =>
    import('@restart/ui/Dropdown').then((m) => m.default)
)

export const dropDownMenuDefaultOptions: UseDropdownMenuOptions = {
    flip: true,
    offset: [0, 2],
    placement: 'bottom-end',
}

export interface DropdownMenuProps extends ButtonProps, Omit<RUDdProps, 'onSelect'> {
    alignEnd?: boolean
    className?: string
    id?: string
    toggleClassName?: string
    menuClassName?: string
    label?: React.ReactNode
    activeIndex?: number
    children: React.ReactNode[]
    inGroup?: boolean
    options?: UseDropdownMenuOptions
}

export const DropdownMenu: FCWC<DropdownMenuProps> = ({
    children,
    label,
    className,
    toggleClassName,
    menuClassName,
    alignEnd,
    inGroup,
    options = dropDownMenuDefaultOptions,
    id: providedId,
    ...buttonProps
}) => {
    const autoId = useId()
    const btnId = providedId || autoId
    const placement = options.placement || alignEnd ? 'bottom-end' : 'bottom-start'
    if (!Dropdown) return null

    return (
        <Dropdown placement="bottom-end">
            <div
                className={cx('dropdown', className, {
                    'btn-group': inGroup,
                })}
            >
                <Toggle>
                    {(props) => (
                        <Button
                            className={cx('dropdown-toggle', toggleClassName)}
                            {...buttonProps}
                            {...props}
                            id={btnId}
                        >
                            {label}
                        </Button>
                    )}
                </Toggle>
                <Menu {...options} placement={placement}>
                    {(menuProps, meta) =>
                        createPortal(
                            <div
                                {...menuProps}
                                aria-labelledby={btnId}
                                className={cx('dropdown-menu', menuClassName)}
                                style={{
                                    transition: 'visibility 500ms, opacity 500ms',
                                    visibility: meta.show ? 'visible' : 'hidden',
                                    opacity: meta.show ? '1' : '0',
                                    display: 'block',
                                    ...menuProps.style,
                                }}
                            >
                                {children}
                            </div>,
                            document.body
                        )
                    }
                </Menu>
            </div>
        </Dropdown>
    )
}
