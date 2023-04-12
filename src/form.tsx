import { FCWC, React, cx, PropsWithChildren, useEffect, useMemo } from './common.js'
import type { AnyObjectSchema } from 'yup'
import { isShallowEqual, errorToString } from './util.js'
import { usePreviousValue } from './hooks.js'
import {
    useForm,
    useWatch as useFormValue,
    FormProvider,
    SubmitHandler,
    FieldError,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from 'boxible'
import { Footer } from './footer.js'
import { FormStatusAlert } from './form-status-alert.js'
import { Button, ButtonProps } from './button.js'
import { ErrorTypes } from './types.js'
import { useCallback } from 'react'

import {
    FormTriggerValidation,
    FORM_ERROR_KEY,
    useController,
    useFormState,
    useFormContext,
} from './form-hooks.js'
import type { FieldState, RegisteredField, FormContext } from './form-hooks.js'
export * from './form-hooks.js'
export * from './date-time-field.js'
export * from './date-time.js'
export * from './floating-field.js'
export * from './input-field.js'
export * from './label.js'
export * from './select-field.js'
export * from './select.js'
export * from './form-hooks.js'
export * from './form-status-alert.js'

export type { FormContext, FieldError, FieldState, RegisteredField }
export { useFormState, useFormValue, useController }

export type FormSubmitHandler<FV extends FormValues = object> = (
    values: FV,
    ctx: FormContext<FV>
) => void | Promise<void>
export type FormCancelHandler<FV extends FormValues = object> = (fc: FormContext<FV>) => void
export type FormDeleteHandler<FV extends FormValues = object> = (fc: FormContext<FV>) => void

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
    const prevDefaultValues = usePreviousValue(defaultValues)
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
                if (error) {
                    fc.setError(FORM_ERROR_KEY, {
                        type: FORM_ERROR_KEY,
                        message: errorToString(error),
                    })
                } else {
                    fc.clearErrors(FORM_ERROR_KEY)
                }
            },
            ...fc,
        }
    }, [fc, readOnly])

    const triggerSubmit = useCallback<SubmitHandler<FV>>(
        async (values) => {
            try {
                await onSubmit(values, extCtx)
                if (!fc.getFieldState('FORM_ERROR').error) {
                    fc.reset(values, {
                        keepTouched: true,
                        keepIsSubmitted: true,
                        keepSubmitCount: true,
                    })
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

export interface SaveCancelBtnProps {
    showControls?: boolean
    onDelete?: FormDeleteHandler<any>
    onCancel?: FormCancelHandler<any>
    saveLabel?: React.ReactNode
    cancelLabel?: React.ReactNode
    deleteLabel?: React.ReactNode
}

export function SaveCancelBtn({
    onCancel,
    onDelete,
    showControls,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    deleteLabel = 'Delete',
}: SaveCancelBtnProps): JSX.Element | null {
    const fc = useFormContext()

    const { isDirty, isSubmitting, isSubmitted } = useFormState()

    if (!showControls && !isDirty && !isSubmitted) {
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

interface EditingFormProps<FV extends FormValues> extends FormProps<FV> {
    name: string
    submittingMessage?: string
    submittedMessage?: string
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
    name,
    submittedMessage,
    submittingMessage,
    ...props
}: EditingFormProps<FV>): JSX.Element {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            {name && (
                <FormStatusAlert
                    name={name}
                    submittingMessage={submittingMessage}
                    submittedMessage={submittedMessage}
                />
            )}
            <SaveCancelBtn
                css={{ textAlign: 'center' }}
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
