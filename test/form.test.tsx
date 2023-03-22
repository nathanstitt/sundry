import * as React from 'react'
//import '@testing-library/jest-dom/extend-expect'
import { Form, InputField, DateTimeField, SelectField } from '../src/form.js'
import * as Yup from 'yup'
import { select } from 'react-select-event'
import userEvent from '@testing-library/user-event'
import { render, screen, cleanup } from '@testing-library/react'
import { dayjs } from '../src/date.js'
import { test, expect, vi, beforeEach } from 'vitest'
import './setup-select.js'

function setup(jsx: any) {
    return {
        user: userEvent.setup(),
        ...render(jsx),
    }
}

beforeEach(cleanup)

test('loads and displays greeting', async () => {
    const onSubmit = vi.fn()

    expect(dayjs('2022-10-10').format('l')).toEqual('10/10/2022')

    const { user } = setup(
        <Form
            defaultValues={{ name: 'Bob', one: '2010-10-10', two: '2010-10-11' }}
            onSubmit={onSubmit}
            action="/foo"
        >
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

    expect(screen.getByLabelText<HTMLInputElement>('Name').value).toEqual('Bob')
    expect(screen.getByLabelText<HTMLInputElement>('Datey').value).toEqual('Oct 10, 2010')
    await user.click(screen.getByTestId('clear-dates'))
    expect(screen.getByLabelText<HTMLInputElement>('Datey').value).toEqual('')

    await user.clear(screen.getByLabelText('Name'))
    await user.type(screen.getByLabelText('Name'), 'a test')

    await user.click(screen.getByLabelText('Datey'))

    await user.click(screen.getByText('15'))
    await user.click(screen.getByText('20'))

    await select(screen.getByLabelText('Selecty'), ['Two'])

    await user.click(screen.getByText('save'))

    expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
            name: 'a test',
            one: dayjs('2010-10-15T05:00:00.000Z').toDate(),
            two: dayjs('2010-10-20T05:00:00.000Z').toDate(),
            sel: 'two',
        }),
        expect.anything()
    )
})

test('validation', async () => {
    const onSubmit = vi.fn()
    const { user, findByText } = setup(
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
    )
    await findByText(/required field/)
    await user.click(screen.getByText('save'))
    expect(onSubmit).not.toHaveBeenCalled()
})
