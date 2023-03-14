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
    Modal,
    Button,
} from './src'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    [key: string]: string | boolean | Date
}

export default function Demo() {
    const onSubmit: FormSubmitHandler<FormData> = (values, _) => {
        console.log(values) // eslint-disable-line no-console
        throw 'uh oh'
        //fc.setFormError(new Error('a save error occured'))
    }
    return (
        <div className="container mt-5">
            <h6 className="mt-4">Form test</h6>
            <EditingForm
                className="row"
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
                <InputField sm={10} data-testid="name" name="name" label="Name" />
                <InputField sm={2} type="checkbox" data-testid="cbv" name="cbv" label="CB" />
                <InputField sm={3} type="radio" name="rbv" value="a" label="A" />
                <InputField sm={3} type="radio" name="rbv" value="b" label="B" />
                <InputField sm={3} type="radio" name="rbv" value="c" label="C" />
                <InputField sm={3} type="radio" name="rbv" value="d" label="D" />
                <SelectField
                    placeholder="Select an option..."
                    label="Options"
                    options={[
                        { label: 'A', value: 'a' },
                        { label: 'B', value: 'b' },
                        { label: 'C', value: 'c' },
                    ]}
                    name="ab"
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

            <h3>Modal Example</h3>
            <ModalExamples />
        </div>
    )
}

const ModalExamples = () => {
    const [show1, setShow1] = React.useState<boolean>(false)
    const [show2, setShow2] = React.useState<boolean>(false)
    const [show3, setShow3] = React.useState<boolean>(false)
    return (
        <Box direction="column" width="20%" gap="large">
            <Button onClick={() => setShow1(true)}>With close btn and no header</Button>
            <Modal center show={show1} onHide={() => setShow1(false)}>
                <Modal.Body>test</Modal.Body>
            </Modal>

            <Button onClick={() => setShow2(true)}>No close button</Button>
            <Modal center show={show2} closeBtn={false} onHide={() => setShow2(false)}>
                <Modal.Body>test</Modal.Body>
            </Modal>

            <Button onClick={() => setShow3(true)}>With header</Button>
            <Modal center show={show3} onHide={() => setShow3(false)}>
                <Modal.Header>A Header</Modal.Header>
                <Modal.Body>Body Text</Modal.Body>
            </Modal>
        </Box>
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
