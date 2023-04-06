import { Box } from 'boxible'
import { FC, React, styled, cx } from './common.js'
import { Icon } from './icon.js'
import { CombinedError } from 'urql'
import { themeColors as colors } from './theme.js'
import { LoadingDots as LD } from './loading-dots.js'
import { ErrorTypes } from './types.js'
import { errorToString } from './util.js'

const DEFAULT_DISPLAY_AFTER = 250
const ICON_HEIGHT = 30 // px

const { useState, useEffect } = React

const H = styled.h3`
    margin: 0;
`

export const StyledMessage = styled(Box)(
    ({ border = '1px solid ${colors.border}' }: { border?: string | false }) => ({
        padding: '1.2rem 2rem',
        border: border ? border : undefined,
        background: colors.well,
        svg: {
            minWidth: 20,
            width: 20,
        },
        'h3 + svg': {
            marginRight: '0.5rem',
        },
        'svg + h3': {
            marginLeft: '0.5rem',
        },
    })
)

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
    border?: string | false
    className?: string
    prefixIcon?: React.ReactNode
    suffixIcon?: React.ReactNode
    expandWidth?: boolean
    overlay?: boolean
}

export const Message: FC<MessageProps> = ({
    variant,
    message,
    border,
    prefixIcon,
    suffixIcon,
    className,
    expandWidth,
    overlay,
}) => (
    <MessageBox
        className={cx('message-box', className, { overlay })}
        data-variant={variant}
        data-test-id="message-box"
        align="center"
        justify="center"
    >
        <StyledMessage
            align="center"
            justify="center"
            border={border}
            width={expandWidth ? 'auto' : '450px'}
        >
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
    <Message
        variant="success"
        message={message}
        prefixIcon={<Icon height={ICON_HEIGHT} icon="thumbsUp" />}
    />
)

export interface LoadingMessageProps extends Omit<BusyMessageProps, 'message'> {
    name?: string
    verb?: string
    message?: string
}
export const LoadingMessage: FC<LoadingMessageProps> = ({
    name,
    className,
    overlay,
    verb = 'Loading',
    message = `${verb} ${name}`,
    ...props
}) => (
    <BusyMessage
        variant="loading"
        overlay={overlay}
        message={message}
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
    error: ErrorTypes
}
export const ErrorMessage: FC<ErrorProps> = ({ error, ...props }) => (
    <Message
        message={`Failure: ${errorToString(error)}`}
        prefixIcon={<Icon height={ICON_HEIGHT} icon="exclamationCircle" />}
        {...props}
    />
)

export const WarningMessage: FC<MessageProps> = ({ message, ...props }) => (
    <Message
        {...props}
        message={message}
        prefixIcon={<Icon height={ICON_HEIGHT} icon="exclamationTriangle" />}
    />
)

interface OptionalMessageProps {
    className?: string
    message?: string
}
export const NotFound: FC<OptionalMessageProps> = ({ message = 'Not Found', ...props }) => (
    <Message
        {...props}
        data-test-id="not-found-msg-box"
        prefixIcon={<Icon height={ICON_HEIGHT} icon="exclamationCircle" />}
        message={message}
    />
)

export interface DelayedProps {
    children: React.ReactElement
    onShown?: () => void
    delayAmount?: number
}

export const Delayed: FC<DelayedProps> = ({
    children,
    onShown,
    delayAmount = DEFAULT_DISPLAY_AFTER,
}) => {
    const [isVisible, setVisible] = useState<boolean>(false)
    const setShown = React.useCallback(() => {
        setVisible(true)
        onShown?.()
    }, [onShown, setVisible])
    useEffect(() => {
        const timeoutId = setTimeout(setShown, delayAmount)
        return () => clearTimeout(timeoutId)
    }, [delayAmount, setShown])
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
