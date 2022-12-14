import { React, FCWC, useState, cx, useCallback } from './common'
import { usePopper } from 'react-popper'
import { useOutsideClickRef, useRefElement } from 'rooks'

interface ControlledPopoverProps {
    show: boolean
    target?: HTMLElement
    title?: React.ReactNode
    type?: 'tooltip' | 'popover'
    onBodyClick?: React.MouseEventHandler<HTMLDivElement>
}

export const ControlledPopover = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<ControlledPopoverProps>
>((forwardedProps, outsideRef) => {
    const { show, title, target, children, onBodyClick, type = 'popover' } = forwardedProps

    const [popover, setPopover] = useState<HTMLDivElement | null>(null)
    const [arrow, setArrow] = useState<HTMLDivElement | null>(null)
    const { styles, attributes } = usePopper(target, popover, {
        modifiers: [{ name: 'arrow', options: { element: arrow } }],
    })
    if (!show) {
        return null
    }

    const pos = (attributes.popper || {})['data-popper-placement']
    return (
        <div
            className={cx(type, 'fade', `bs-${type}-${pos}`, { show })}
            role="tooltip"
            ref={setPopover}
            style={styles.popper}
            {...attributes.popper}
        >
            <div className={`${type}-arrow`} ref={setArrow} style={styles.arrow} />
            {title && type === 'popover' && <h3 className="popover-header">{title}</h3>}
            <div
                className={cx({
                    'popover-body': type === 'popover',
                    'tooltip-inner': type === 'tooltip',
                })}
                ref={outsideRef}
                onClick={onBodyClick}
            >
                {children}
            </div>
        </div>
    )
})
ControlledPopover.displayName = 'ControlledPopover'

interface PopoverProps extends Omit<ControlledPopoverProps, 'show'> {
    popover: React.ReactNode
    onShow?(): void
    onHide?(): void
    showOnHover?: boolean
}

export const Popover: FCWC<PopoverProps> = ({
    popover,
    children,
    showOnHover,
    onShow: onShowProp,
    onHide: onHideProp,
    ...popoverProps
}) => {
    const [isShown, setIsShown] = useState(false)
    const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | undefined>()
    const onShow = useCallback(() => {
        setIsShown(true)
        setTimeout(() => onShowProp?.(), 1)
    }, [onShowProp, setIsShown])
    const onHide = useCallback(() => {
        setIsShown(false)
        onHideProp?.()
    }, [onHideProp, setIsShown])
    const [ref] = useOutsideClickRef(onHide)

    return (
        <div
            ref={(s) => setWrapperRef(s || undefined)}
            className="popover-wrapper"
            onClick={onShow}
            onMouseEnter={() => {
                showOnHover && onShow()
            }}
            onMouseLeave={() => {
                showOnHover && onHide()
            }}
        >
            {children}
            <ControlledPopover ref={ref} target={wrapperRef} show={isShown} {...popoverProps}>
                {popover}
            </ControlledPopover>
        </div>
    )
}

interface TooltipProps extends Omit<ControlledPopoverProps, 'show'> {
    tooltip: React.ReactNode
}

export const Tooltip: FCWC<TooltipProps> = ({ tooltip, children, ...tooltipProps }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [setWrapperRef, wrapperRef] = useRefElement<HTMLElement>()

    return (
        <div
            ref={setWrapperRef}
            className="tooltip-wrapper"
            onMouseEnter={() => {
                setIsHovered(true)
            }}
            onMouseLeave={() => {
                setIsHovered(false)
            }}
        >
            {children}
            <ControlledPopover
                target={wrapperRef || undefined}
                show={isHovered}
                type="tooltip"
                {...tooltipProps}
            >
                {tooltip}
            </ControlledPopover>
        </div>
    )
}
