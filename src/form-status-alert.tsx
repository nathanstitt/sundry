import { FC, React, styled, useState, cx, css } from './common.js'
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
    showPending?: boolean
    submittingMessage?: string
    submittedMessage?: string
}


export const FormStatusAlert: FC<FormStatusAlertProps> = ({
    name,
    showPending = true,
    submittingMessage = `${name} is saving`,
    submittedMessage = `${name} was saved`,
}) => {
    const [err, _onDismiss] = useFormError()
    const { isSubmitting, isSubmitSuccessful } = useFormState()
    const [wasShown, setWasShown] = useState<false | 'pending' | 'shown' | 'error' | 'success'>(false)

    let body: React.ReactElement<any, any> | null = null

    const onDismiss = useCallback(() => {
        setWasShown(false)
        _onDismiss()
    }, [_onDismiss])
    useEffect(() => {
        if (err) {
            setWasShown('error')
        } else if (showPending && isSubmitting) {
            setWasShown('pending')
        } else if (isSubmitSuccessful) {
            setWasShown('success')
        }
    }, [isSubmitting, wasShown, isSubmitSuccessful, err])

    if (wasShown == 'pending' || wasShown == 'shown') {
        body = (
            <Delayed onShown={() => setWasShown('shown')}>
                <LoadingMessage padding={12} message={submittingMessage} />
            </Delayed>
        )
    } else if (wasShown == 'error') {
        body = <ErrorAlert data-testid="form-save-error-alert" height="100%" error={err} onDismiss={onDismiss} />
    } else if (wasShown == 'success') {
        body = <Alert data-testid="form-save-success-alert" height="100%" message={submittedMessage} />
    }

    if (body) {
        return <StatusWrapper className="form-status">{body}</StatusWrapper>
    }

    return null
}
