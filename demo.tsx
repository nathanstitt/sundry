import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Form, DateTimeField, InputField, Yup, FormSubmitHandler } from './src'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    name: string
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
                <DateTimeField name="dates" rangeNames={['from', 'to']} label="Date Range" />
                <button type="submit">save</button>
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
