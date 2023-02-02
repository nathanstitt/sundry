import { createRoot } from 'react-dom/client'
import * as React from 'react'
import {
    EditingForm,
    DateTimeField,
    SelectField,
    InputField,
    Yup,
    FormSubmitHandler,
    DropdownMenu,
    Section,
    Box,
} from './src'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    [key: string]: string | boolean | Date
}

export default function Demo() {
    const onSubmit: FormSubmitHandler<FormData> = (values, fc) => {
        console.log(values) // eslint-disable-line no-console
        throw 'uh oh'
        //fc.setFormError(new Error('a save error occured'))
    }
    return (
        <div className="container mt-5">
            <h6 className="mt-4">Form test</h6>
            <EditingForm
                className="row"
				readOnly
                defaultValues={{
                    name: '',
                    cbv: true,
                    rbv: 'c',
                    from: new Date('2022-10-21'),
                    to: new Date('2022-11-02'),
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required(),
                })}
                validateOnMount
                onSubmit={onSubmit}
            >
                <InputField sm={10} data-testid="name" name="name" disabled label="Name" />
                <InputField sm={2} type="checkbox" data-testid="cbv" name="cbv" label="CB" />

                <InputField sm={3} type="radio" name="rbv" value="a" label="A" />
                <InputField sm={3} type="radio" name="rbv" value="b" label="B" />
                <InputField sm={3} type="radio" name="rbv" value="c" label="C" />
                <InputField sm={3} type="radio" name="rbv" value="d" label="D" />
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
            </EditingForm>

            <h6 className="mt-4">Dropdown test</h6>
            <div className="row">
                <DropdownMenu alignEnd label="Pick Option" activeIndex={1}>
                    <div className="dropdown-item">one</div>
                    <div className="dropdown-item">two</div>
                    <hr className="dropdown-divider" />
                    <div className="dropdown-item">three</div>
                </DropdownMenu>
            </div>

            <h6 className="mt-4">Section test</h6>
            <Box direction="column">
                <h4>hi</h4>
                <Section id="section-test" className="mb-4" heading="This is a section">
                    <div style={{ border: '1px solid blue', margin: 20 }}>
                        <h5>Hello world</h5>
                        <button
                            onClick={(ev) => {
                                ev.currentTarget.parentElement!.style!.height = '200px'
                            }}
                        >
                            make bigger
                        </button>
                    </div>
                </Section>
            </Box>
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
