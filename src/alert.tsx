import { React, FC, useEffect, cx, useState } from './common'
import { CombinedError, UseMutationState } from 'urql'
import styled from '@emotion/styled'
import { BSVariants, bsClassNames } from './bs'
import { Delayed } from './ui-state'
import { Icon } from './icon'

export interface AlertProps extends BSVariants {
    message?: string
    onDismiss?(): void
    className?: string
    canDismiss?: boolean
}

export const Alert: FC<AlertProps> = ({
    message,
    onDismiss,
    className = '',
    canDismiss = true,
    ...types
}) => {
    const [visible, setVisible] = useState(canDismiss)
    useEffect(() => {
        setVisible(!!message)
    }, [message])
    const onDismissClick = () => {
        onDismiss?.()
        setVisible(false)
    }
    if (!(visible && message)) {
        return null
    }

    return (
        <div
            role="alert"
            data-test-id="alert"
            className={cx('alert', bsClassNames('alert', types)[0], className, {
                'alert-dismissible': canDismiss,
            })}
        >
            <div>{message}</div>
            {canDismiss && (
                <button
                    type="button"
                    className="btn-close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={onDismissClick}
                />
            )}
        </div>
    )
}

export type ErrorTypes = CombinedError | Error | string | false | undefined

interface ErrorAlertProps {
    error?: ErrorTypes
    onDismiss?(): void
}
export const ErrorAlert: FC<ErrorAlertProps> = ({ error, onDismiss: onDismissProp }) => {
    const [err, setError] = useState<ErrorTypes>(error)
    useEffect(() => {
        setError(error)
    }, [error])
    if (!err) {
        return null
    }
    const onDismiss = () => {
        setError(false)
        onDismissProp?.()
    }
    return (
        <Alert danger message={typeof err == 'object' ? err?.message : err} onDismiss={onDismiss} />
    )
}

const Pending = styled.span({
    display: 'inline-flex',
    gap: '0.5rem',
    alignItems: 'center',
})
export const usePendingMutationError = (resp: UseMutationState) => {
    const [err, setError] = useState<CombinedError | undefined | string | false>(resp.error)
    useEffect(() => {
        setError(resp.error)
    }, [resp.error])
    if (resp.fetching) {
        return (
            <Delayed>
                <Pending>
                    <Icon icon="clock" /> Saving…
                </Pending>
            </Delayed>
        )
    }
    const onDismiss = () => {
        setError(false)
    }
    if (err) {
        return (
            <Alert
                danger
                message={typeof err == 'object' ? err?.message : err}
                onDismiss={onDismiss}
            />
        )
    }
    return null
}
