import { FCWOC, FCWC, React, cx, PropsWithChildren, useEffect, useMemo } from './common'
import { AnyObjectSchema } from 'yup'
import { isShallowEqual, errorToString } from './util'
import { usePreviousDifferent } from 'rooks'
import {
    useWatch as useFormValue,
    FieldValues,
    FormProvider,
    SubmitHandler,
    UseFormReturn,
    UseFormRegisterReturn,
    UseFormGetFieldState,
    useFormContext as _useFormContext,
    useForm,
    useController,
    useFormState,
    FieldError,
    FieldPath,
    UseControllerReturn,
} from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from 'boxible'
import { Footer } from './footer'
import { ErrorAlert } from './alert'
import { Button, ButtonProps } from './button'
import { ErrorTypes } from './types'
import { useCallback } from 'react'

type FieldState = UseFormGetFieldState<Record<string, string>>
type RegisteredField = UseFormRegisterReturn<any>
export type { FieldError, FieldState, RegisteredField }

export { useFormState, useFormValue, useController }

const FORM_ERROR_KEY = 'FORM_ERROR'

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

export type FormSubmitHandler<FV extends FormValues> = (
    values: FV,
    ctx: FormContext<FV>
) => void | Promise<any>
export type FormCancelHandler<FV extends FormValues> = (fc: FormContext<FV>) => void
export type FormDeleteHandler<FV extends FormValues> = (fc: FormContext<FV>) => void

export type FormValues = Record<string, any>

interface FormProps<FV extends FormValues> {
    children: React.ReactNode
    className?: string
    readOnly?: boolean
    onDelete?: FormDeleteHandler<FV>
    onCancel?: FormCancelHandler<FV>
    showControls?: boolean
    enableReinitialize?: boolean
    action?: string
    defaultValues: FV
    validateOnMount?: boolean
    onReset?: (values: FV, ctx: FormContext<FV>) => void
    onSubmit: FormSubmitHandler<FV>
    validationSchema?: AnyObjectSchema
}

export const FormTriggerValidation: FCWOC = () => {
    const { trigger } = useFormContext()
    useEffect(() => {
        trigger()
    }, [trigger])
    return null
}

export function Form<FV extends FormValues>({
    action,
    children,
    onSubmit,
    readOnly,
    className,
    defaultValues,
    validateOnMount,
    validationSchema,
    enableReinitialize = true,
}: PropsWithChildren<FormProps<FV>>): JSX.Element {
    const fc = useForm({
        mode: 'onBlur',
        defaultValues: defaultValues as any,
        resolver: validationSchema ? yupResolver(validationSchema as any) : undefined,
        // resolver: async (a, b, c) => {
        //     const ret = await r(a, b, c)
        //     console.log(ret)
        //     fc.setError('name' as any, { type: 'readonly', message: 'required' })
        //     return ret
        // },
    })
    const prevDefaultValues = usePreviousDifferent(defaultValues)
    useEffect(() => {
        if (enableReinitialize) {
            if (prevDefaultValues && !isShallowEqual(prevDefaultValues, defaultValues)) {
                fc.reset(defaultValues, { keepDirtyValues: true })
            }
        }
    }, [fc, prevDefaultValues, enableReinitialize, defaultValues])

    const extCtx: FormContext<FV> = useMemo(() => {
        return {
            isReadOnly: !!readOnly,
            setFormError(error: ErrorTypes) {
                fc.setError(FORM_ERROR_KEY, { type: FORM_ERROR_KEY, message: errorToString(error) })
            },
            ...fc,
        }
    }, [fc, readOnly])

    const triggerSubmit = useCallback<SubmitHandler<FV>>(
        async (values) => {
            try {
                await onSubmit(values, extCtx)
                if (!fc.getFieldState('FORM_ERROR').error) {
                    fc.reset(values)
                }
            } catch (err: any) {
                extCtx.setFormError(err)
            }
        },
        [onSubmit, extCtx, fc]
    )

    return (
        <FormProvider {...extCtx}>
            <form
                method="POST"
                action={action}
                className={className}
                onSubmit={fc.handleSubmit(triggerSubmit)}
            >
                {validateOnMount ? <FormTriggerValidation /> : null}
                {children}
            </form>
        </FormProvider>
    )
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

type FormCancelButtonProps = ButtonProps & {
    onCancel?: FormCancelHandler<any>
}
export const FormCancelButton: FCWC<FormCancelButtonProps> = ({
    children,
    onCancel,
    onClick,
    ...props
}) => {
    const fc = useFormContext()
    const {
        formState: { isSubmitting },
    } = fc

    const onFormCancel = useCallback(
        (ev: React.MouseEvent<HTMLButtonElement>) => {
            fc.reset()
            onClick?.(ev)
            onCancel?.(fc)
        },
        [fc, onClick, onCancel]
    )

    return (
        <Button
            secondary
            data-test-id="form-cancel-btn"
            onClick={onFormCancel}
            disabled={isSubmitting}
            {...props}
        >
            {children}
        </Button>
    )
}

export const FormSaveButton: FCWC<Omit<ButtonProps, 'busy'>> = ({
    children,
    busyMessage = 'Saving',
    type = 'submit',
    secondary,
    primary = secondary !== true,
    ...props
}) => {
    const { isSubmitting } = useFormState()

    return (
        <Button
            type={type}
            secondary={secondary}
            primary={primary}
            busyMessage={busyMessage}
            busy={isSubmitting}
            data-test-id="form-save-btn"
            {...props}
        >
            {children}
        </Button>
    )
}

interface SaveCancelBtnProps {
    showControls?: boolean
    onDelete?: FormDeleteHandler<any>
    onCancel?: FormCancelHandler<any>
    saveLabel?: React.ReactNode
    cancelLabel?: React.ReactNode
    deleteLabel?: React.ReactNode
}

function SaveCancelBtn({
    onCancel,
    onDelete,
    showControls,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    deleteLabel,
}: SaveCancelBtnProps): JSX.Element | null {
    const fc = useFormContext()

    const { isDirty, isSubmitting } = useFormState()

    if (!showControls && !isDirty) {
        return null
    }

    const onFormDelete = () => onDelete?.(fc)

    return (
        <Footer justify={onDelete ? 'between' : 'end'}>
            {onDelete && (
                <Button
                    danger
                    data-test-id="form-delete-btn"
                    disabled={isSubmitting}
                    onClick={onFormDelete}
                >
                    {deleteLabel}
                </Button>
            )}
            <Box gap>
                {(isDirty || onCancel) && (
                    <FormCancelButton onCancel={onCancel}>{cancelLabel}</FormCancelButton>
                )}
                <FormSaveButton primary>{saveLabel}</FormSaveButton>
            </Box>
        </Footer>
    )
}

export function FormError() {
    const fc = useFormContext()
    const fs = useFormState({ name: FORM_ERROR_KEY })

    const err = fs.errors[FORM_ERROR_KEY] as undefined | ErrorTypes
    const onDismiss = () => {
        fc.clearErrors(FORM_ERROR_KEY)
    }
    return <ErrorAlert error={err} onDismiss={onDismiss} />
}

interface EditingFormProps<FV extends FormValues> extends FormProps<FV> {
    saveLabel?: React.ReactNode
    cancelLabel?: React.ReactNode
    deleteLabel?: React.ReactNode
}

export function EditingForm<FV extends FormValues>({
    children,
    showControls,
    className,
    onCancel,
    onDelete,
    saveLabel,
    cancelLabel,
    deleteLabel,
    ...props
}: EditingFormProps<FV>): JSX.Element {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            <FormError />
            <SaveCancelBtn
                saveLabel={saveLabel}
                cancelLabel={cancelLabel}
                deleteLabel={deleteLabel}
                onCancel={onCancel}
                onDelete={onDelete}
                showControls={showControls}
            />
        </Form>
    )
}
