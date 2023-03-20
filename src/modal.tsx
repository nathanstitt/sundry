import { React, styled, cx, FCWC } from './common.js'
import type { BaseModalProps } from '@restart/ui/Modal'
import { Icon } from './icon.js'
import OverlayModal from '@restart/ui/Modal'

const renderBackdrop = (props: any) => {
    return <div className="modal-backdrop fade show" {...props} />
}

export interface ModalProps extends Omit<BaseModalProps, 'children'> {
    className?: string
    title?: React.ReactNode
    header?: React.ReactNode
    show?: boolean
    onHide?: () => void
    xlarge?: boolean
    scrollable?: boolean
    fullscreen?: boolean
    large?: boolean
    small?: boolean
    closeBtn?: boolean
    center?: boolean
}

const Content = styled.div()

interface ModalI extends FCWC<ModalProps> {
    Header: FCWC<ModalPartProps>
    Body: FCWC<ModalPartProps>
    Footer: FCWC<ModalPartProps>
}

const Modal: ModalI = ({
    className,
    header,
    children,
    show,
    title,
    onHide,
    xlarge,
    large,
    small,
    fullscreen,
    scrollable = true,
    closeBtn = true,
    center = false,
    ...props
}) => {
    if (!OverlayModal) return null

    return (
        <OverlayModal
            {...props}
            show={show}
            className={cx(className, 'modal', 'fade', {
                show,
            })}
            style={{ display: 'block', pointerEvents: 'none', overflow: scrollable ? '' : 'auto' }}
            renderBackdrop={renderBackdrop}
            onBackdropClick={onHide}
        >
            <div
                className={cx('modal-dialog', {
                    'modal-dialog-scrollable': scrollable,
                    'modal-xl': xlarge,
                    'modal-fullscreen-lg-down': xlarge,
                    'modal-lg': large,
                    'modal-fullscreen': fullscreen,
                    'modal-small': small,
                    'modal-dialog-centered': center,
                })}
            >
                <Content className="modal-content">
                    {header && header}
                    {title && (
                        <Modal.Header>
                            <h5 className="modal-title">{title}</h5>
                            {closeBtn && (
                                <Icon
                                    data-test-id="modal-close-btn"
                                    icon="close"
                                    onClick={onHide}
                                    height={28}
                                    width={28}
                                />
                            )}
                        </Modal.Header>
                    )}
                    {children}
                </Content>
            </div>
        </OverlayModal>
    )
}

interface ModalPartProps {
    className?: string
}

const Header: React.FC<ModalPartProps> = (props) => (
    <div {...props} className={cx('modal-header', props.className)} />
)
Modal.Header = Header

const Body: React.FC<ModalPartProps> = (props) => (
    <div {...props} className={cx('modal-body', props.className)} />
)
Modal.Body = Body

const Footer: React.FC<ModalPartProps> = (props) => (
    <div {...props} className={cx('modal-footer', props.className)} />
)
Modal.Footer = Footer

export { Modal }
