import { FC, React, styled, useState, emptyFn } from './common.js'
import { ErrorTypes } from './types.js'
import { FORM_ERROR_KEY, useFormState, useFormContext } from './form-hooks.js'
import { ErrorAlert, Alert } from './alert.js'
import { Delayed, LoadingMessage } from './ui-state.js'
import { useCallback, useEffect } from 'react'

const useFormError = (): [ErrorTypes, () => void] => {
    const fc = useFormContext()
    const fs = useFormState({ name: FORM_ERROR_KEY })

    const err = fs.errors[FORM_ERROR_KEY] as undefined | ErrorTypes
    const onDismiss = () => {
        fc.clearErrors(FORM_ERROR_KEY)
    }
    return [err, onDismiss]
}

export const FormError: FC = () => {
    const [err, onDismiss] = useFormError()

    return <ErrorAlert error={err} onDismiss={onDismiss} />
}

const StatusWrapper = styled.div({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '.alert, .message-box': { marginBottom: 0 },
})

interface FormStatusAlertProps {
    verb?: string
    name: string
    enabled?: boolean
    showPending?: boolean
    submittingMessage?: string
    submittedMessage?: string
    onDismiss?: typeof emptyFn,
}


export const FormStatusAlert: FC<FormStatusAlertProps> = ({
    name,
    enabled = true,
    showPending = true,
    onDismiss,
    submittingMessage = `${name} is saving`,
    submittedMessage = `${name} was saved`,
}) => {
    const [err, _onDismiss] = useFormError()
    const { isSubmitting, isSubmitSuccessful } = useFormState()
    const [wasShown, setWasShown] = useState<false | 'pending' | 'shown' | 'error' | 'success'>(false)

    let body: React.ReactElement<any, any> | null = null

    const onHide = useCallback(() => {
        setWasShown(false)
        _onDismiss()
        onDismiss?.()
    }, [_onDismiss, onDismiss])

    useEffect(() => {
        if (!enabled) return

        if (err) {
            setWasShown('error')
        } else if (showPending && isSubmitting) {
            setWasShown('pending')
        } else if (isSubmitSuccessful) {
            setWasShown('success')
        }
    }, [isSubmitting, wasShown, isSubmitSuccessful, err, enabled, showPending])

    if (wasShown == 'pending' || wasShown == 'shown') {
        body = (
            <Delayed onShown={() => setWasShown('shown')}>
                <LoadingMessage padding={12} message={submittingMessage} />
            </Delayed>
        )
    } else if (wasShown == 'error') {
        body = <ErrorAlert data-testid="form-save-error-alert" height="100%" error={err} onDismiss={onHide} />
    } else if (wasShown == 'success') {
        body = <Alert data-testid="form-save-success-alert" height="100%" message={submittedMessage} onDismiss={onHide} />
    }

    if (body) {
        return <StatusWrapper className="form-status">{body}</StatusWrapper>
    }

    return null
}
