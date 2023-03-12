import { React, FCWC, FC, cx, useId } from './common.js'
import type {
    UseDropdownMenuOptions,
    DropdownMenuProps as RUDdMProps,
    DropdownToggleProps,
    DropdownProps as RUDdProps,
} from '@restart/ui/Dropdown'

import { Button, ButtonProps } from './button.js'

interface DD extends FC<RUDdProps> {
    Toggle: FC<DropdownToggleProps>
    Menu: FC<RUDdMProps>
}

let Dropdown: DD | null = null
import('@restart/ui/Dropdown').then((dd) => (Dropdown = dd.default))

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
                <Dropdown.Toggle>
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
                </Dropdown.Toggle>
                <Dropdown.Menu {...options} placement={placement}>
                    {(menuProps, meta) => (
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
                        </div>
                    )}
                </Dropdown.Menu>
            </div>
        </Dropdown>
    )
}