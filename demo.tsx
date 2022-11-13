import { createRoot } from 'react-dom/client'
import * as React from 'react'
import {
    Form,
    DateTimeField,
    SelectField,
    InputField,
    Yup,
    FormSubmitHandler,
    useFormState,
} from './src'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    name: string
}

const SubmitBtn = () => {
    const fs = useFormState()
    return (
        <button type="submit" style={{ background: fs.isDirty ? 'green' : 'gray' }}>
            save
        </button>
    )
}

export default function Demo() {
    const onSubmit: FormSubmitHandler<FormData> = (v) => {
        console.log(v)
    }
    return (
        <div className="container mt-5">
            <Form
                defaultValues={{
                    name: '',
                    from: new Date('2022-10-21'),
                    to: new Date('2022-11-02'),
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required(),
                })}
                validateOnMount
                onSubmit={onSubmit}
            >
                <InputField data-testid="name" name="name" label="Name" />

                <SelectField
                    label="Select a value"
                    options={[
                        { label: 'A', value: 'a' },
                        { label: 'B', value: 'b' },
                        { label: 'C', value: 'c' },
                    ]}
                    name="ab"
                />

                <DateTimeField name="dates" rangeNames={['from', 'to']} label="Date Range" />

                <SubmitBtn />
            </Form>
        </div>
    )
}

window.addEventListener('DOMContentLoaded', (event) => {
    const el = document.getElementById('app')
    const root = createRoot(el)
    root.render(
        <React.StrictMode>
            <Demo />
        </React.StrictMode>
    )
})
