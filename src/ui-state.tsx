import { FC, React } from './common'
import styled from '@emotion/styled'
import { cx } from '@emotion/css'
import { Box } from 'boxible'
import { Icon } from './icon'
import { CombinedError } from 'urql'
import { themeColors as colors } from './theme'
import { LoadingDots as LD } from './loading-dots'

const DEFAULT_DISPLAY_AFTER = 250

const { useState, useEffect } = React

const H = styled.h3`
    margin: 0;
`

export const StyledMessage = styled(Box)`
    padding: 1.2rem 2rem;
    border: 1px solid ${colors.border};
    background: ${colors.well};
    svg {
        min-width: 20px;
        width: 20px;
    }
    h3 + svg {
        margin-right: 0.5rem;
    }
    svg + h3 {
        margin-left: 0.5rem;
    }
`

const BOX_WIDTH = 360

export const MessageBox = styled(Box)({
    '&.overlay': {
        position: 'absolute',
        top: 120,
        width: BOX_WIDTH,
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        left: `calc(50% - ${BOX_WIDTH / 2}px)`,
        background: 'white',
    },
})

export interface MessageProps {
    message: React.ReactNode
    variant?: string
    className?: string
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
    expandWidth?: boolean
    overlay?: boolean
}

export const Message: FC<MessageProps> = ({
    variant,
    message,
    prefixIcon,
    suffixIcon,
    className,
    expandWidth,
    overlay,
}) => (
    <MessageBox
        className={cx(className, { overlay })}
        data-variant={variant}
        data-test-id="message-box"
        align="center"
        justify="center"
    >
        <StyledMessage align="center" justify="center" width={expandWidth ? 'auto' : '450px'}>
            {prefixIcon}
            <H>{message}</H>
            {suffixIcon}
        </StyledMessage>
    </MessageBox>
)

export interface BusyMessageProps extends MessageProps {
    variant?: string
}
export const BusyMessage: FC<BusyMessageProps> = ({ variant, message, className, ...props }) => (
    <Message
        className={className}
        variant={variant || 'busy'}
        message={message}
        suffixIcon={<LD color="black" />}
        {...props}
    />
)

export interface SuccessPropsI {
    message: React.ReactNode
}
export const SuccessMessage: FC<BusyMessageProps> = ({ message }) => (
    <Message variant="success" message={message} prefixIcon={<Icon icon="thumbsUp" />} />
)

export interface LoadingMessageProps extends Omit<BusyMessageProps, 'message'> {
    name: string
    verb?: string
}
export const LoadingMessage: FC<LoadingMessageProps> = ({
    name,
    className,
    overlay,
    verb = 'Loading',
    ...props
}) => (
    <BusyMessage
        variant="loading"
        overlay={overlay}
        message={`${verb} ${name}`}
        className={className}
        {...props}
    />
)

export interface SavingProps {
    name: string
}
export const Saving: FC<SavingProps> = ({ name }) => (
    <Message message={`Saving ${name}`} suffixIcon={<LD color="black" />} />
)

export interface ErrorProps extends Omit<MessageProps, 'message'> {
    error: string | Error
}
export const ErrorMessage: FC<ErrorProps> = ({ error, ...props }) => (
    <Message
        message={`Failure: ${String(error)}`}
        prefixIcon={<Icon icon="exclamationCircle" />}
        {...props}
    />
)

export const WarningMessage: FC<MessageProps> = ({ message, ...props }) => (
    <Message {...props} message={message} prefixIcon={<Icon icon="exclamationTriangle" />} />
)

interface OptionalMessageProps {
    className?: string
    message?: string
}
export const NotFound: FC<OptionalMessageProps> = ({ message = 'Not Found', ...props }) => (
    <Message
        {...props}
        data-test-id="not-found-msg-box"
        prefixIcon={<Icon icon="exclamationCircle" />}
        message={message}
    />
)

export interface DelayedProps {
    children: React.ReactElement
    delayAmount?: number
}

export const Delayed: FC<DelayedProps> = ({ children, delayAmount = DEFAULT_DISPLAY_AFTER }) => {
    const [isVisible, setVisible] = useState<boolean>(false)
    useEffect(() => {
        const timeoutId = setTimeout(() => setVisible(true), delayAmount)
        return () => clearTimeout(timeoutId)
    }, [delayAmount])
    if (isVisible) {
        return children
    }
    return null
}

export interface QueryPayload<D> {
    fetching: boolean
    stale: boolean
    error?: CombinedError
    data?: D
}

export interface PendingUIChecks {
    [name: string]: QueryPayload<any>
}

export const Pending: FC<{ name: string; options?: Omit<LoadingMessageProps, 'name'> }> = ({
    name,
    options = {},
}) => {
    return (
        <Delayed>
            <LoadingMessage {...options} name={name} />
        </Delayed>
    )
}

export function usePendingUI(
    checks: PendingUIChecks,
    options: Omit<LoadingMessageProps, 'name'> = {}
): React.ReactElement<any> | null {
    for (const checkName of Object.keys(checks)) {
        const { fetching, error } = checks[checkName]
        if (fetching) {
            return <Pending name={checkName} />
        }
        if (error) {
            return <ErrorMessage error={error} {...options} />
        }
    }
    return null
}
