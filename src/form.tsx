import { FCWOC, FCWC, React, cx, PropsWithChildren, useEffect, useMemo } from './common'
import { AnyObjectSchema } from 'yup'
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
} from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from 'boxible'
import { Footer } from './footer'
import { ErrorAlert } from './alert'
import { Button, ButtonProps } from './button'
import { ErrorTypes } from './types'
import { isEmpty } from './util'
import { useCallback } from 'react'

type FieldState = UseFormGetFieldState<Record<string, string>>
type RegisteredField = UseFormRegisterReturn<any>
export type { FieldState, RegisteredField }

export { useFormState, useFormValue }

const FORM_ERROR_KEY = 'FORM_ERROR'

export const useFormContext = _useFormContext as any as <
    TFV extends FieldValues
>() => UseFormReturn<TFV> & {
    isReadOnly: boolean
    setFormError(err: ErrorTypes): void
}

export type FormContext<T extends FieldValues> = UseFormReturn<T>

export function useFieldState(name: string) {
    return useFormContext().getFieldState(name)
}

export function useField(name: string) {
    const { isReadOnly } = useFormContext()
    const fc = useController({ name })
    return { isReadOnly, ...fc }
}

export type FormSubmitHandler<FV extends FormValues> = (
    values: FV,
    ctx: FormContext<FV> & { setFormError(err: ErrorTypes): void }
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
    //const [formError, setFormError] = useState<ErrorTypes>()

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
            if (isEmpty(prevDefaultValues) && !isEmpty(defaultValues)) {
                fc.reset(defaultValues, { keepDirtyValues: true })
            }
        }
    }, [fc, prevDefaultValues, enableReinitialize, defaultValues])

    const fs = useMemo(
        () => ({
            isReadOnly: readOnly,
            setFormError(error: ErrorTypes) {
                fc.setError(FORM_ERROR_KEY, error as any)
            },
            ...fc,
        }),
        [fc, readOnly]
    )

    const triggerSubmit = useCallback<SubmitHandler<FV>>(
        async (values) => {
            try {
                await onSubmit(values, fs)
                fc.reset(values)
            } catch (err: any) {
                fs.setFormError(err)
            }
        },
        [onSubmit, fs, fc]
    )

    return (
        <FormProvider {...fs}>
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

export const FormCancelButton: FCWC<ButtonProps> = ({ children, ...props }) => {
    const fc = useFormContext()
    const {
        formState: { isSubmitting },
    } = fc
    return (
        <Button disabled={isSubmitting} {...props}>
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
            type="submit"
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
}

function SaveCancelBtn({
    onCancel,
    onDelete,
    showControls,
}: SaveCancelBtnProps): JSX.Element | null {
    const fc = useFormContext()

    const { isDirty, isSubmitting } = useFormState()

    if (!showControls && !isDirty) {
        return null
    }

    const onFormCancel = async () => {
        fc.reset()
        onCancel?.(fc)
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
                    Delete
                </Button>
            )}
            <Box gap>
                {onCancel && (
                    <Button
                        data-test-id="form-cancel-btn"
                        disabled={isSubmitting}
                        onClick={onFormCancel}
                    >
                        Cancel
                    </Button>
                )}
                <FormSaveButton primary>Save</FormSaveButton>
            </Box>
        </Footer>
    )
}

export function FormSaveError() {
    const fc = useFormContext()
    const err = fc.formState.errors[FORM_ERROR_KEY] as undefined | ErrorTypes
    const onDismiss = () => {
        fc.clearErrors(FORM_ERROR_KEY)
    }
    return <ErrorAlert error={err} onDismiss={onDismiss} />
}

export function EditingForm<FV extends FormValues>({
    children,
    showControls,
    className,
    onCancel,
    onDelete,
    ...props
}: FormProps<FV>): JSX.Element {
    return (
        <Form {...props} className={cx('editing', 'row', className)}>
            {children}
            <FormSaveError />
            <SaveCancelBtn onCancel={onCancel} onDelete={onDelete} showControls={showControls} />
        </Form>
    )
}
