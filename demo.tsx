import { createRoot } from 'react-dom/client'
import * as React from 'react'
import { Form, InputField, Yup, FormSubmitHandler } from './src'

import 'bootstrap/dist/css/bootstrap.css'

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
                defaultValues={{ name: '' }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required(),
                })}
                validateOnMount
                onSubmit={onSubmit}
            >
                <InputField data-testid="name" name="name" label="Name" />
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
