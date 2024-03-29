import { createRoot } from 'react-dom/client'
import styled from '@emotion/styled'
import * as React from 'react'
import {
    Row,
    Col,
    Box,
    Alert,
    Button,
    DateTimeField,
    DropdownMenu,
    EditingForm,
    FormSubmitHandler,
    Icon,
    InputField,
    Message,
    Modal,
    Section,
    SelectField,
    SelectOnChangeHandler,
    Toast,
    useDeviceSize,
    useFormState,
    whenDomReady,
    Yup,
} from './src/all.js'
import './test/setup-select.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'flatpickr/dist/flatpickr.css'

interface FormData {
    [key: string]: string | boolean | Date | { name: string }[]
}

const StyledCheckbox = styled(InputField)({
    border: 0,
    '.form-check-input, &.form-check-input': {
        height: 16,
        width: 16,
        '&:checked': {
            backgroundColor: 'gray',
            borderColor: 'red',
        },
    },
})

export default function Demo() {
    const [isExpanded, setExpanded] = React.useState(false)
    const [defaultValue, setDefaultValue] = React.useState({
        name: 'test',
        nested: [{ name: 'b' }],
        cbv: true,
        bc: 'a',
        rbv: 'c',
        simpleDate: new Date(),
        from: new Date('2022-10-21'),
        to: new Date('2022-11-02'),
    } satisfies FormData)
    const displaySize = useDeviceSize()
    const onSubmit: FormSubmitHandler<FormData> = async (values, fc) => {
        console.log(values) // eslint-disable-line no-console

        await new Promise((r) => setTimeout(r, 2000))

        setDefaultValue({...defaultValue, name: values.name + `-${fc.formState.submitCount}` })

        //throw 'uh oh'
        //fc.setFormError(new Error('a save error occured'))
    }
    const logSelectChange: SelectOnChangeHandler = (v) => {
        console.log(v)
    }
    return (
        <div className="container mt-5">
            <Message
                message="hello"
                hint="This is a test of the MessageBox"
                prefixIcon={<Icon icon="clock" />}
            />
            <Alert height="33px" danger onDismiss={() => {}} message="this is test" />

            <h6>Display size = {displaySize}</h6>

            <Box gap="large">
                <Button
                    icon="clock"
                    tooltip="Click to show a Toast Message"
                    onClick={() =>
                        Toast.show({
                            title: 'cool title!',
                            message: 'hello',
                            autohide: false,
                            placement: 'topRight',
                        })
                    }
                >
                    Show Toast
                </Button>

                <Button
                    onClick={() =>
                        Toast.show({
                            message: (
                                <>
                                    hello it is <b>time</b>
                                </>
                            ),
                            autohide: false,
                        })
                    }
                >
                    <Icon icon="clock" />
                    Show Toast without title
                </Button>
            </Box>

            <h6 className="mt-4">Form test</h6>
            <EditingForm
                name="Demo Form"
                className="row"
                defaultValues={defaultValue}
                validationSchema={Yup.object().shape({
                    name: Yup.string().required(),
                    simpleDate: Yup.date().required(),
                    from: Yup.date().required(),
                })}
                validateOnMount
                onSubmit={onSubmit}
            >
                <InputField sm={10} data-testid="name" name="name" label="Name" />
                <StyledCheckbox
                    sm={2}
                    type="checkbox"
                    data-testid="cbv"
                    name="cbv"
                    label="CheckBox field"
                />

                <Box>
                    <StyledCheckbox
                        sm={2}
                        type="checkbox"
                        id="custom-checkbox"
                        data-testid="cbv2"
                        name="cbv2"
                    />
                    <label htmlFor="custom-checkbox">Custom and cool!</label>
                </Box>
                <Col size={12}>
                    <Row>
                        <InputField sm={3} type="radio" name="rbv" value="a" label="A" order={{ md: 4 }} />
                        <InputField sm={3} type="radio" name="rbv" value="b" label="B" order={{ md: 3 }} />
                        <InputField sm={3} type="radio" name="rbv" value="c" label="C" order={{ md: 2 }} />
                        <InputField sm={3} type="radio" name="rbv" value="d" label="D" order={{ md: 1 }} />
                    </Row>
                </Col>
                <SelectField
                    size={3}
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
                    isMulti wrapDisplayedLabels
                    options={[
                        { label: 'A long choice', value: 'a' },
                        { label: 'B a longer choice that is not selected', value: 'b' },
                        { label: 'C an even longer choice than the previous one', value: 'c' },
                        { label: 'D A long choice', value: 'd' },
                        { label: 'E a longer choice that is not selected', value: 'e' },
                        { label: 'F an even longer choice than the previous one', value: 'f' },
                        { label: 'G A long choice', value: 'g' },
                        { label: 'H a longer choice that is not selected', value: 'h' },
                        { label: 'I an even longer choice than the previous one', value: 'i' },
                    ]}
                    name="bc"
                />
                <DateTimeField name="simpleDate" label="Simple Date" />
                <DateTimeField name="dates" rangeNames={['from', 'to']} label="Date Range" />
                <FormValidDisplay />
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
                    onToggle={() => setExpanded(!isExpanded)}
                    isExpanded={isExpanded}
                    className="mb-4"
                    heading="This is a section"
                    footer={<Box justify="end">This is footer</Box>}
                >
                    <div style={{ border: '1px solid blue', margin: 20 }}>
                        <h5>Hello World</h5>
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
            <h3>Modal Example</h3>

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

const FormValidDisplay: React.FC = () => {
    const { isValid } = useFormState()
    return <h3> {isValid ? 'Valid' : 'Invalid'} </h3>
}

whenDomReady(() => {
    const el = document.getElementById('app')
    const root = createRoot(el!)
    root.render(
        <React.StrictMode>
            <Demo />
        </React.StrictMode>
    )
})
