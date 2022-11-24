import { React, FC, useEffect, cx, useState } from './common'
import { ColProps } from './col'
import { CombinedError } from 'urql'
import styled from '@emotion/styled'
import { errorToString } from './util'
import { BSVariants, bsClassNames } from './bs'
import { Delayed } from './ui-state'
import { Icon } from './icon'
import { ErrorTypes } from './types'

export interface AlertProps extends BSVariants, ColProps {
    message?: string
    onDismiss?(): void
    className?: string
    canDismiss?: boolean
}

const Wrapper = styled.div({
    '.row > &': {
        marginLeft: 'calc(var(--bs-gutter-x) * 0.5)',
        marginRight: 'calc(var(--bs-gutter-x) * 0.5)',
        flex: 1,
    },
})

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
        <Wrapper
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
        </Wrapper>
    )
}

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

    return <Alert danger message={errorToString(error)} onDismiss={onDismiss} />
}

const Pending = styled.span({
    display: 'inline-flex',
    gap: '0.5rem',
    alignItems: 'center',
})

interface PendingMutationReply {
    error?: CombinedError
    fetching?: any
}
export type PendingMutationOptions = {
    message: string
}
export function usePendingMutationError(
    resp: PendingMutationReply,
    options: PendingMutationOptions = { message: 'Saving…' }
) {
    const [err, setError] = useState<CombinedError | undefined | false>(resp.error)
    useEffect(() => {
        setError(resp.error)
    }, [resp.error])
    if (resp.fetching) {
        return (
            <Delayed>
                <Pending>
                    <Icon icon="clock" /> {options.message}
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
