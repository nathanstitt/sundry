import { React, FC, useEffect, useRef, cx, useState } from './common.js'
import { createRoot } from 'react-dom/client'
import type BSToastT from 'bootstrap/js/dist/toast'

export interface ToastProps extends Partial<BSToastT.Options> {
    title?: string
    className?: string
    message?: React.ReactNode
    error?: any
    placement?: ToastPlacement
}

export type ToastPlacement =
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'middleLeft'
    | 'middleCenter'
    | 'middleRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'

export const toastPlacementMap: Record<ToastPlacement, string> = {
    topLeft: 'top-0 start-0',
    topCenter: 'top-0 start-50 translate-middle-x',
    topRight: 'top-0 end-0',
    middleLeft: 'top-50 start-0 translate-middle-y',
    middleCenter: 'top-50 start-50 translate-middle',
    middleRight: 'top-50 end-0 translate-middle-y',
    bottomLeft: 'bottom-0 start-0',
    bottomCenter: 'bottom-0 start-50 translate-middle-x',
    bottomRight: 'bottom-0 end-0',
}

export const ToastC: FC<ToastProps> = ({
    title,
    className,
    message,
    error,
    delay = 5000,
    autohide = true,
    animation = true,
}) => {
    const [isHidden, setHidden] = useState(false)
    const toastRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = toastRef.current
        if (!el) return
        import('bootstrap/js/dist/toast').then(({ default: BSToast }) => {
            let bsToast = BSToast.getInstance(el)
            if (!bsToast) {
                bsToast = new BSToast(el, {
                    delay,
                    autohide,
                    animation,
                })
                el.addEventListener('hidden.bs.toast', function () {
                    el.parentElement?.remove()
                    setHidden(true)
                })
                bsToast.show()
            }
        })
    })
    if (isHidden) return null

    if (error) {
        if (!title) title = 'An error occured'
        if (!message) message = error.message
    }
    if (!title) {
        return (
            <div
                role="alert"
                ref={toastRef}
                data-error={!!error}
                className={cx('toast', className)}
            >
                <div className="d-flex">
                    <div className="toast-body">{message}</div>
                    <button
                        type="button"
                        className="btn-close me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                    ></button>
                </div>
            </div>
        )
    }

    return (
        <div role="alert" ref={toastRef} data-error={!!error} className={cx('toast', className)}>
            <div
                className={cx('toast-header', {
                    'bg-danger': error,
                    'text-light': error,
                })}
            >
                <strong className="me-auto">{title}</strong>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
            <div className="toast-body">{message}</div>
        </div>
    )
}

export const Toast = {
    show: (props: ToastProps) => {
        let root = document.getElementById('toast-root')
        if (!root) {
            root = document.createElement('div')
            root.id = 'toast-root'
            root.style.zIndex = '250'
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.gap = '.5rem'
            root.className = `toast-container position-fixed ${
                toastPlacementMap[props.placement || 'topRight']
            } p-2`
            document.body.appendChild(root)
        }
        const toastEl = document.createElement('div')
        root.appendChild(toastEl)
        createRoot(toastEl).render(<ToastC {...props} />)
    },
}
