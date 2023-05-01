import {
    React, FC, useEffect, useRef, cx, useState,
} from './common.js'
import { createRoot } from 'react-dom/client'

export const ToastContainer = () => {
    return (
        <div
            className="position-relative"
            aria-live="polite"
            aria-atomic="true"
        >
            <div
                id="toast-container"
            >

            </div>
        </div>
    )
}

export interface ToastProps {
    title?: string
    className?: string
    message?: React.ReactNode
    error?: any
}



export const ToastC: FC<ToastProps> = ({ title, className, message, error }) => {
    const [isHidden, setHidden] = useState(false)
    const toastRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = toastRef.current
        if (!el) return
        import('bootstrap/js/dist/toast').then(({ default: BSToast }) => {
            let bsToast = BSToast.getInstance(el)
            if (!bsToast) {
                bsToast = new BSToast(el)
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
    return (
        <div
            role="alert" ref={toastRef}
            data-error={!!error}
            className={cx('toast', className)}
        >
            <div
                className={cx('toast-header', {
                    'bg-danger': error,
                    'text-light': error,
                })}
            >
                <strong className="me-auto">{title}</strong>
                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
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
            root.className = 'toast-container position-fixed top-0 end-0 p-2'
            document.body.appendChild(root)
        }
        const toastEl = document.createElement('div')
        root.appendChild(toastEl)
        createRoot(toastEl).render(<ToastC {...props} />)
    },
}
