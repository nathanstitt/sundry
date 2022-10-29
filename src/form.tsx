import { FCWC, React, cx, useState, PropsWithChildren, useContext, useMemo } from './common'
import { useForm, useController as useField } from 'react-hook-form'
import type {
    Field,
    Control,
    ControllerFieldState as FieldState,
    UseFormRegister,
    SubmitHandler,
    UseFormWatch,
    UseFormReset,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from 'boxible'
import { Footer } from './footer'
import { ErrorAlert, ErrorTypes } from './alert'
import { Button, ButtonProps } from './button'

export { useField, FieldState }
export interface FormContext<FV extends FormValues> {
    isDirty: boolean
    control: Control<FV, any>
    isReadOnly?: boolean
    isSubmitting: boolean
    formError?: ErrorTypes
    setFormError(error?: ErrorTypes): void
    register: UseFormRegister<FV>
    watch: UseFormWatch<FV>
    resetForm: UseFormReset<FV>
    setFieldValue(name: string, value: any): void
    getField(name: string): Field['_f'] | undefined
}

export const FORM_CONTEXT = React.createContext<FormContext<any> | undefined>(undefined)

export function useFormContext<FV extends FormValues>(): FormContext<FV> {
    return useContext(FORM_CONTEXT) as FormContext<FV>
}

export type FormSubmitHandler<FV extends FormValues> = (
    values: FV,
    ctx: FormContext<FV>
) => void | Promise<any>
export type FormCancelHandler<FV extends FormValues> = (fc: FormContext<FV>) => void
export type FormDeleteHandler<FV extends FormValues> = (fc: FormContext<FV>) => void

type FormValues = Record<string, any>

// interface FormHelpers<FV extends FormValues> {
//     values: T
// }
//
interface FormProps<FV extends FormValues> {
    children: React.ReactNode
    className?: string
    readOnly?: boolean
    onDelete?: FormDeleteHandler<FV>
    onCancel?: FormCancelHandler<FV>
    showControls?: boolean
    action?: string
    defaultValues: FV
    onReset?: (values: FV, ctx: FormContext<FV>) => void
    onSubmit: FormSubmitHandler<FV>
    validationSchema?: any | (() => any)
}

export function Form<FV extends FormValues>({
    children,
    onSubmit,
    readOnly,
    defaultValues,
    validationSchema,
}: PropsWithChildren<FormProps<FV>>): JSX.Element {
    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting, isDirty },
    } = useForm<FV>({
        defaultValues: defaultValues as any,
        resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    })

    const [formError, setFormError] = useState<ErrorTypes>()
    const context = useMemo(
        () => ({
            isSubmitting,
            control,
            isReadOnly: readOnly,
            register,
            isDirty,
            watch,
            formError,
            getField: (name: string) => control._fields[name]?._f,
            setFieldValue(name: string, value: any) {
                control._formValues[name] = value
            },
            resetForm: reset,
            setFormError,
        }),
        [register, control, isSubmitting, setFormError, formError, isDirty, watch, reset, readOnly]
    )

    const triggerSubmit: SubmitHandler<FV> = async (values) => {
        try {
            await onSubmit(values, context)
        } catch (err: any) {
            context.setFormError(err)
        }
    }
    return (
        <form onSubmit={handleSubmit(triggerSubmit)}>
            <FORM_CONTEXT.Provider value={context}>{children}</FORM_CONTEXT.Provider>
        </form>
    )
}

export const FormCancelButton: FCWC<ButtonProps> = ({ children, ...props }) => {
    const fc = useFormContext()
    const { isSubmitting } = fc
    return (
        <Button disabled={isSubmitting} {...props}>
            {children}
        </Button>
    )
}

export const FormSaveButton: FCWC<ButtonProps> = ({
    children,
    busyMessage = 'Saving',
    type = 'submit',
    ...props
}) => {
    const fc = useFormContext()
    const { isSubmitting } = fc
    return (
        <Button
            type="submit"
            busyMessage={busyMessage}
            busy={isSubmitting}
            data-test-id="form-save-btn"
            {...props}
        >
            {children}
        </Button>
    )
}

interface SaveCancelBtnProps<FV extends FormValues> {
    showControls?: boolean
    onDelete?: FormDeleteHandler<FV>
    onCancel?: FormCancelHandler<FV>
}

function SaveCancelBtn<FV extends FormValues>({
    onCancel,
    onDelete,
    showControls,
}: SaveCancelBtnProps<FV>): JSX.Element | null {
    const fc = useFormContext<FV>()
    const { isSubmitting, resetForm, isDirty } = fc
    if (!showControls && !isDirty) {
        return null
    }

    const onFormCancel = async () => {
        resetForm()
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
                <FormSaveButton busy={isSubmitting} primary>
                    Save
                </FormSaveButton>
            </Box>
        </Footer>
    )
}

export function FormSaveError<FV extends FormValues>() {
    const fc = useFormContext<FV>()
    const onDismiss = () => {
        fc.setFormError(false)
    }
    return <ErrorAlert error={fc.formError} onDismiss={onDismiss} />
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
