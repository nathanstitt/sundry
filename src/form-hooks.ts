import { useCallback, useEffect } from 'react'
import { FCWOC, ErrorTypes } from './types.js'

import {
    FieldValues,
    UseFormReturn,
    UseFormRegisterReturn,
    UseFormGetFieldState,
    useController,
    useFormState,
    useFormContext as _useFormContext,
    FieldPath,
    UseControllerReturn,
} from 'react-hook-form'

export { useController, useFormState }

export type FieldState = UseFormGetFieldState<Record<string, string>>

export type RegisteredField = UseFormRegisterReturn<any>

export const FORM_ERROR_KEY = 'FORM_ERROR'

export const FormTriggerValidation: FCWOC = () => {
    const { trigger } = useFormContext()
    useEffect(() => {
        trigger()
    }, [trigger])
    return null
}

export type FormContext<T extends FieldValues> = UseFormReturn<T> & {
    isReadOnly: boolean
    setFormError(err: ErrorTypes): void
}

export const useFormContext = _useFormContext as any as <
    TFV extends FieldValues
>() => FormContext<TFV>

export function useFieldState(name: string) {
    return useFormContext().getFieldState(name)
}

export type UseFieldReturn<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = UseControllerReturn<TFieldValues, TName> & { isReadOnly: boolean }

export function useField(name: string): UseFieldReturn {
    const { isReadOnly } = useFormContext()
    const fc = useController({ name })
    return { isReadOnly, ...fc }
}

export const useSetFormError = () => {
    const fc = useFormContext()
    return useCallback(
        (err: ErrorTypes) => {
            fc.setError(FORM_ERROR_KEY, err as any)
        },
        [fc]
    )
}
