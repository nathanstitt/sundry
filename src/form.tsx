import { FCWC, React, cx, PropsWithChildren, useEffect, useMemo } from './common.js'
import type { ReactNode } from 'react'
import type { AnyObjectSchema } from 'yup'
import { isShallowEqual, errorToString } from './util.js'
import { usePreviousValue, useToggle } from './hooks.js'
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
export type FormDeleteHandler<FV extends FormValues = object> = (fc: FormContext<FV>) => Promise<void>

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

const KEEP_STATE = {
    keepTouched: true,
    keepIsSubmitted: true,
    keepIsValid: true,
    keepSubmitCount: true,
    keepDirty: true,
    keepErrors: true,
//    keepDirtyValues: true,
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
                fc.reset(defaultValues, KEEP_STATE)
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
            } catch (err: any) {
                extCtx.setFormError(err)
            }
        },
        [onSubmit, extCtx]
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
            data-testid="form-cancel-btn"
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
            data-testid="form-save-btn"
            {...props}
        >
            {children}
        </Button>
    )
}

export interface SaveCancelBtnProps {
    children?: ReactNode
    showControls?: boolean
    onDelete?: FormDeleteHandler<any>
    onCancel?: FormCancelHandler<any>
    saveLabel?: React.ReactNode
    cancelLabel?: React.ReactNode
    deleteLabel?: React.ReactNode
    saveBusyMessage?: string
    cancelBusyMessage?: string
    deleteBusyMessage?: string
}

export function SaveCancelBtn({
    onCancel,
    onDelete,
    children,
    showControls,
    saveLabel = 'Save',
    saveBusyMessage,
    cancelBusyMessage = 'Canceling',
    deleteBusyMessage = 'Deleting',
    cancelLabel = 'Cancel',
    deleteLabel = 'Delete',
}: SaveCancelBtnProps): JSX.Element | null {
    const fc = useFormContext()

    const { isDirty, isSubmitting, isSubmitted } = useFormState()
    const { isEnabled: isDeleting,  setEnabled: setDeleting, setDisabled: setDeleteFinished } = useToggle()

    if (!onDelete && !showControls && !isDirty && !isSubmitted) {
        return null
    }

    const onFormDelete = () => {
        setDeleting()
        onDelete?.(fc).then(setDeleteFinished)
    }

    return (
        <Footer justify={onDelete ? 'between' : 'end'}>
            {onDelete && (
                <Button
                    danger
                    data-testid="form-delete-btn"
                    disabled={isSubmitting}
                    onClick={onFormDelete}
                    busyMessage={deleteBusyMessage}
                    busy={isDeleting}
                >
                    {deleteLabel}
                </Button>
            )}
            {children}
            <Box gap>
                {(isDirty || onCancel) && (
                    <FormCancelButton onCancel={onCancel} busyMessage={cancelBusyMessage}>{cancelLabel}</FormCancelButton>
                )}
                <FormSaveButton primary busyMessage={saveBusyMessage}>{saveLabel}</FormSaveButton>
            </Box>
        </Footer>
    )
}

interface EditingFormProps<FV extends FormValues> extends FormProps<FV> {
    name: string
    hideStatus?: boolean
    submittingMessage?: string
    submittedMessage?: string
    saveLabel?: React.ReactNode
    cancelLabel?: React.ReactNode
    deleteLabel?: React.ReactNode
    saveBusyMessage?: string
    cancelBusyMessage?: string
    deleteBusyMessage?: string
    showPendingStatus?: boolean
}

export function EditingForm<FV extends FormValues>({
    children,
    showControls,
    className,
    onCancel,
    onDelete,
    hideStatus,
    name,
    cancelLabel,
    deleteLabel,
    saveLabel,
    submittedMessage,
    submittingMessage,
    saveBusyMessage,
    cancelBusyMessage,
    deleteBusyMessage,
    showPendingStatus = false,
    ...props
}: EditingFormProps<FV>): JSX.Element {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            <SaveCancelBtn
                saveLabel={saveLabel}
                cancelLabel={cancelLabel}
                deleteLabel={deleteLabel}
                onCancel={onCancel}
                onDelete={onDelete}
                showControls={showControls}
                saveBusyMessage={saveBusyMessage}
                cancelBusyMessage={cancelBusyMessage}
                deleteBusyMessage={deleteBusyMessage}
            >
                <FormStatusAlert
                    enabled={!hideStatus}
                    name={name}
                    showPending={showPendingStatus}
                    submittingMessage={submittingMessage}
                    submittedMessage={submittedMessage}
                />
            </SaveCancelBtn>
        </Form>
    )
}
