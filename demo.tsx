import { createRoot } from 'react-dom/client'
import * as React from 'react'
import {
    Box,
    Yup,
    Message,
    Section,
    InputField,
    EditingForm,
    SelectField,
    DropdownMenu,
    DateTimeField,
    FormSubmitHandler,
    SelectOnChangeHandler,
} from './src/all.js'
import './test/setup-select.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    [key: string]: string | boolean | Date
}

export default function Demo() {
    const [isExpanded, setExpanded] = React.useState(false)
    const onSubmit: FormSubmitHandler<FormData> = async (values, _) => {
        console.log(values) // eslint-disable-line no-console

        await new Promise((r) => setTimeout(r, 2000))
        //throw 'uh oh'
        //fc.setFormError(new Error('a save error occured'))
    }
    const logSelectChange: SelectOnChangeHandler = (v) => {
        console.log(v)
    }
    return (
        <div className="container mt-5">
            <Message message="hello" />
            <h6 className="mt-4">Form test</h6>
            <EditingForm
                name="Demo Form"
                className="row"
                defaultValues={{
                    name: '',
                    nested: [
                        {
                            name: 'b',
                        },
                    ],
                    cbv: true,
                    bc: 'a',
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
                <InputField sm={10} data-testid="name" name="name" label="Name" />
                <InputField sm={2} type="checkbox" data-testid="cbv" name="cbv" label="CB" />
                <InputField sm={3} type="radio" name="rbv" value="a" label="A" />
                <InputField sm={3} type="radio" name="rbv" value="b" label="B" />
                <InputField sm={3} type="radio" name="rbv" value="c" label="C" />
                <InputField sm={3} type="radio" name="rbv" value="d" label="D" />
                <SelectField
                    onChange={logSelectChange}
                    placeholder="Select an option..."
                    label="Options"
                    options={[
                        { label: 'A', value: 'a' },
                        { label: 'B', value: 'b' },
                        { label: 'C', value: 'c' },
                    ]}
                    name="nested[0].name"
                />
                <SelectField
                    placeholder="Select without a label"
                    options={[
                        { label: 'A', value: 'a' },
                        { label: 'B', value: 'b' },
                        { label: 'C', value: 'c' },
                    ]}
                    name="bc"
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
            <Box direction="column" style={{ minHeight: '300px' }}>
                <h4>hi</h4>
                <Section
                    id="section-test"
                    onToggle={(v) => setExpanded(!isExpanded)}
                    isExpanded={isExpanded}
                    className="mb-4"
                    heading="This is a section"
                    footer={<Box justify="end">This is footer</Box>}
                >
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
