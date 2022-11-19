import { React, FC, FCWOC, useLayoutEffect, cx, useId } from './common'
import styled from '@emotion/styled'
import Dropdown, { DropdownProps as RUDdProps } from '@restart/ui/Dropdown'
import ReactDOM from 'react-dom'
import { useDropdownMenu, UseDropdownMenuOptions } from '@restart/ui/DropdownMenu'
import { useDropdownToggle } from '@restart/ui/DropdownToggle'
import { Button, ButtonProps } from './button'

const ToggleWrapper = styled(Button)({
    height: '100%',
})

type ToggleProps = Omit<ButtonProps, 'onSelect'>

const Toggle: FCWOC<ToggleProps> = ({ className, children, ...props }) => {
    const [toggleProps] = useDropdownToggle()

    return (
        <ToggleWrapper {...props} className={cx(className, 'dropdown-toggle')} {...toggleProps}>
            {children}
        </ToggleWrapper>
    )
}

interface MenuProps {
    options?: UseDropdownMenuOptions
    className?: string
}
const MenuWrapper = styled.div({
    zIndex: 1100,
})

export const dropDownMenuDefaultOptions: UseDropdownMenuOptions = {
    flip: true,
    offset: [0, 2],
    //placement: 'bottom-end',
}

const Menu: FCWOC<MenuProps> = ({ children, className, options = dropDownMenuDefaultOptions }) => {
    const [menuProps, meta] = useDropdownMenu(options)

    useLayoutEffect(() => {
        if (meta.show) {
            console.log('updat')
            meta.popper?.update()
        }
        // identity of meta.popper changes on every render, using it in deps
        // leads to infinite loop
    }, [meta.show]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!meta.hasShown) return null

    return ReactDOM.createPortal(
        <MenuWrapper
            {...menuProps}
            style={{
                display: 'block',
                transition: 'visibility 500ms, opacity 500ms',
                visibility: meta.show ? 'visible' : 'hidden',
                opacity: meta.show ? '1' : '0',
                ...menuProps.style,
            }}
            className={cx('dropdown-menu', className, {
                show: meta.show,
            })}
        >
            {children}
        </MenuWrapper>,
        document.body
    )
}

export interface DropdownMenuProps extends RUDdProps {
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

export const DropdownMenu: FC<DropdownMenuProps> = ({
    children,
    label,
    className,
    toggleClassName,
    alignEnd,
    menuClassName,
    inGroup,
    options = dropDownMenuDefaultOptions,
    id: providedId,
    ...buttonProps
}) => {
    const autoId = useId()
    const btnId = providedId || autoId
    const placement = alignEnd ? 'bottom-end' : 'bottom-start'

    return (
        <Dropdown placement={placement}>
            <div className={cx('yn', className, { 'btn-group': inGroup })}>
                <Toggle {...buttonProps} className={toggleClassName}>
                    {label}
                </Toggle>
                <Menu options={options} className={menuClassName} aria-labelledby={btnId}>
                    {children}
                </Menu>
            </div>
        </Dropdown>
    )
}
// export const DropdowsnButton = () => {
//     return (
//         <Dropdown drop="down">
//             <Dropdown.Toggle id="example-toggle">
//                 {(props) => (
//                     <Button type="button" {...props}>
//                         Click to open
//                     </Button>
//                 )}
//             </Dropdown.Toggle>
//             <Dropdown.Menu offset={[0, 12]}>
//                 {(props, { show }) =>
//                     ReactDOM.createPortal(
//                         <div
//                             {...props}
//                             className={`${show ? "flex" : "hidden"
//                                 } p-3 shadow-lg border-grey-200 bg-white z-10 rounded`}
//                         >
//                             <p>I am rendered into the document body</p>
//                         </div>,
//                         document.body
//                     )
//                 }
//             </Dropdown.Menu>
//         </Dropdown>
//     )
// }
// const DropdownfButton: FC<DropdownProps> = ({
//     children,
//     label,
//     className,
//     toggleClassName,
//     alignEnd,
//     menuClassName,
//     inGroup,
//     id: providedId,
//     ...buttonProps
// }) => {
//     const autoId = useId()
//     const btnId = providedId || autoId

//     return (
//         <Dropdown>
//             <Dropdown.Toggle>
//                 {(props) => (
//                     <Button {...props} className={cx('caret', toggleClassName)}>
//                         {label}
//                     </Button>
//                 )}
//             </Dropdown.Toggle>
//             <Dropdown.Menu flip >
//                 {(menuProps, meta) => ReactDOM.createPortal((
//                     <div
//                         {...menuProps}
//                         className={cx('dropdfown-menu', menuClassName, {
//                             show: meta.show,
//                         })}
//                         style={{
//                             transition: "visibility 500ms, opacity 500ms",
//                             //       visibility: meta.show ? "flex" : "hidden",

//                             opacity: meta.show ? "1" : "0",
//                         }}
//                     >
//                         {children}
//                     </div>
//                 ), document.body)}
//             </Dropdown.Menu>
//         </Dropdown >
//     )

// const [isOpen, setOpen] = useState(false)
// const [popover, setPopoverRef] = useState<HTMLDivElement | null>()

// const [target, setTarget] = useState<SVGSVGElement | HTMLButtonElement | null>(null)

// const { styles, attributes } = usePopper(target, popover, {
//     placement: `bottom-${alignEnd ? 'end' : 'start'}`,
//     strategy: 'fixed',
//     modifiers: [{ name: 'offset', options: { offset: [0, 5] } }],
// })

// const onClosingClick = useCallback(() => {
//     setOpen(false)
// }, [setOpen])

// const onBtnClick = useCallback(() => {
//     setOpen(!isOpen)
// }, [isOpen, setOpen])

// const [outsideClickRef] = useOutsideClickRef(onClosingClick, isOpen)

// return (
//     <Dropdown >
//         <div className={cx('dropdown', className, { 'btn-group': inGroup })}>
//             <DropdownToggle
//                 {...buttonProps}
//                 className={toggleClassName}
//             >
//                 {label}
//             </DropdownToggle>
//             <DropdownMenu
//                 className={menuClassName}
//                 aria-labelledby={btnId}
//             >
//                 {children}
//             </DropdownMenu>
//         </div>
//     </Dropdown >
// )
//}
