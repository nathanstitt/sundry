import { FC, React, styled, useState } from './common.js'
import { ErrorTypes } from './types.js'
import { usePreviousValue } from './hooks.js'
import { FORM_ERROR_KEY, useFormState, useFormContext } from './form-hooks.js'
import { ErrorAlert, Alert } from './alert.js'
import { Delayed, LoadingMessage } from './ui-state.js'
import { useEffect } from 'react'

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
    minHeight: '75px',
})

interface FormStatusAlertProps {
    verb?: string
    name: string
    submittingMessage?: string
    submittedMessage?: string
}
export const FormStatusAlert: FC<FormStatusAlertProps> = ({
    name,
    submittingMessage = `${name} is saving`,
    submittedMessage = `${name} was submitted`,
}) => {
    const [err, onDismiss] = useFormError()
    const { submitCount, isSubmitting, isDirty } = useFormState()
    const [wasShown, _setWasShown] = useState(false)
    const previousSubmitCount = usePreviousValue(submitCount || 0)
    let body: React.ReactElement<any, any> | null = null

    const setWasShown = () => _setWasShown(true)
    const wasSubmittedShown = Boolean(
        submittedMessage && previousSubmitCount != null && previousSubmitCount !== submitCount
    )

    if (isSubmitting)
        body = (
            <Delayed onShown={setWasShown}>
                <LoadingMessage message={submittingMessage} />
            </Delayed>
        )
    if (err) body = <ErrorAlert error={err} onDismiss={onDismiss} />

    if (wasSubmittedShown && submittedMessage) {
        body = <Alert message={submittedMessage} />
    }

    useEffect(() => {
        if (wasSubmittedShown && isDirty) {
            _setWasShown(false)
        } else if (err || wasSubmittedShown) {
            setWasShown()
        }
    }, [err, wasSubmittedShown, isDirty])

    if (body || wasShown) {
        return <StatusWrapper>{body}</StatusWrapper>
    }

    return null
}
