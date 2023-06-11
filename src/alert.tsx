import { React, FC, useEffect, cx, styled, useState } from './common.js'
import { ColProps } from './col.js'
import { Box, BoxProps } from 'boxible'
import { errorToString } from './util.js'
import { BSVariants, bsClassNames } from './bs.js'
import { Delayed } from './ui-state.js'
import { Icon } from './icon.js'
import { ErrorTypes, CombinedError } from './types.js'

export interface AlertProps extends BSVariants, ColProps {
    icon?: React.ReactNode
    message?: React.ReactNode
    onDismiss?(): void
    className?: string
    canDismiss?: boolean
    height?: BoxProps['height']
}

const Wrapper = styled(Box)({
    '.row > &': {
        marginLeft: 'calc(var(--bs-gutter-x) * 0.5)',
        marginRight: 'calc(var(--bs-gutter-x) * 0.5)',
        flex: 1,
    },
    '--bs-alert-padding-y': '0',
    alignItems: 'center',
    '&.alert-dismissible': {
        paddingRight: 0,
        '.btn-close': {
            position: 'initial',
            height: '100%',
            padding: '0 1rem',
        }
    }
})

export const Alert: FC<AlertProps> = ({
    message,
    onDismiss,
    icon,
    className = '',
    canDismiss = true,
    height = '55px',
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
    if (typeof icon == 'string') {
        icon = <Icon icon={icon as any} />
    }
    return (
        <Wrapper
            role="alert"
            height={height}
            data-testid="alert"
            className={cx('alert', bsClassNames('alert', types)[0], className, {
                'alert-dismissible': canDismiss,
            })}
        >
            <Box gap align={'center'} flex>{icon}{message}</Box>
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

interface ErrorAlertProps extends AlertProps {
    error?: ErrorTypes
    onDismiss?(): void
}
export const ErrorAlert: FC<ErrorAlertProps> = ({ error, onDismiss: onDismissProp, ...alertProps}) => {
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

    return <Alert {...alertProps} icon="exclamationCircle" danger message={errorToString(error)} onDismiss={onDismiss} />
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
