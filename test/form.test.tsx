import * as React from 'react'
import { Form } from '../src/form'
import { InputField } from '../src/input-field'
import { DateTimeField } from '../src/date-time-field'
import { SelectField } from '../src/select-field'
import { select } from 'react-select-event'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import dayjs from 'dayjs'

function setup(jsx: any) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

test('loads and displays greeting', async () => {
    const onSubmit = jest.fn()

    const { user } = setup(
        <Form defaultValues={{ name: 'Bob' }} onSubmit={onSubmit} action="/foo">
            <h1>hi </h1>
            <InputField data-testid="name" name="name" label="Name" />
            <DateTimeField rangeNames={['one', 'two']} data-testid="dte" name="dte" label="Datey" />
            <SelectField
                name="sel"
                id="sel"
                label="Selecty"
                options={[
                    { label: 'One', value: 'one' },
                    { label: 'Two', value: 'two' },
                    { label: 'Three', value: 'three' },
                ]}
            />
            <button type="submit">save</button>
        </Form>
    )

    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'a test')

    //await user.click(screen.getByTestId('dte'))
    await user.click(screen.getByLabelText('Datey'))

    await user.click(screen.getByText('15'))
    await user.click(screen.getByText('20'))

    await select(screen.getByLabelText('Selecty'), ['Two'])

    await user.click(screen.getByText('save'))

    expect(onSubmit).toHaveBeenCalledWith(
        {
            name: 'a test',
            one: dayjs().startOf('month').add(14, 'day').toDate(),
            two: dayjs().startOf('month').add(19, 'day').toDate(),
            sel: 'two',
        },
        expect.anything()
    )
})
