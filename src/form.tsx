import {
    FCWOC,
    FCWC,
    React,
    cx,
    useState,
    PropsWithChildren,
    useEffect,
    useContext,
    useMemo,
} from './common'
import { AnyObjectSchema } from 'yup'
import { useForm, useController } from 'react-hook-form'
import type {
    Field,
    ControllerFieldState as FieldState,
    SubmitHandler,
    UseFormReturn,
    UseFormGetFieldState,
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from 'boxible'
import { Footer } from './footer'
import { ErrorAlert, ErrorTypes } from './alert'
import { Button, ButtonProps } from './button'

export type FieldWithState = Field['_f'] & {
    state: ReturnType<UseFormGetFieldState<Record<string, string>>>
}

export { FieldState }
export interface FormContext<FV extends FormValues> extends UseFormReturn<FV> {
    isDirty: boolean
    isReadOnly?: boolean
    isSubmitting: boolean
    formError?: ErrorTypes
    setFormError(error?: ErrorTypes): void
    getField(name: string): FieldWithState | undefined
}

export const FORM_CONTEXT = React.createContext<FormContext<any> | undefined>(undefined)

export function useFormContext<FV extends FormValues>(): FormContext<FV> {
    return useContext(FORM_CONTEXT) as FormContext<FV>
}

export function useField<FV extends FormValues>(name: string) {
    const fc = useFormContext<FV>()
    const { control, setValue, isReadOnly } = fc
    const fld = useController({ name: name as any, control })

    return {
        isReadOnly,
        setValue: (value: any) => setValue(name as any, value),
        ...fld,
    }
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
// validationSchema ? yupResolver(validationSchema) : undefined,
export function Form<FV extends FormValues>({
    children,
    onSubmit,
    readOnly,
    defaultValues,
    validateOnMount,
    validationSchema,
}: PropsWithChildren<FormProps<FV>>): JSX.Element {
    const [formError, setFormError] = useState<ErrorTypes>()

    const fc = useForm<FV>({
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

    const context = useMemo(
        () => ({
            ...fc,
            isSubmitting: fc.formState.isSubmitting,
            isReadOnly: readOnly,
            isDirty: fc.formState.isDirty,
            formError,
            getField: (name: string) =>
                fc.control._fields[name]
                    ? {
                          state: fc.control.getFieldState(name as any),
                          ...fc.control._fields[name]!._f, // eslint-disable-line @typescript-eslint/no-non-null-assertion
                      }
                    : undefined,
            setFormError,
        }),
        [fc, readOnly, formError]
    )

    const triggerSubmit: SubmitHandler<FV> = async (values) => {
        try {
            await onSubmit(values, context)
        } catch (err: any) {
            context.setFormError(err)
        }
    }

    return (
        <form onSubmit={fc.handleSubmit(triggerSubmit)}>
            <FORM_CONTEXT.Provider value={context}>
                {validateOnMount ? <FormTriggerValidation /> : null}
                {children}
            </FORM_CONTEXT.Provider>
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
    const { isSubmitting, reset, isDirty } = fc
    if (!showControls && !isDirty) {
        return null
    }

    const onFormCancel = async () => {
        reset()
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
