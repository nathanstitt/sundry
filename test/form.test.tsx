import * as React from 'react'
import { Form } from '../src/form'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('loads and displays greeting', async () => {
    const onSubmit = jest.fn()
    // ARRANGE
    render(
        <Form initialValues={{ name: 'Bob' }} onSubmit={onSubmit} action="/foo">
            {' '}
            <h1>hi </h1>
        </Form>
    )

    // ACT
    await userEvent.click(screen.getByText('hi'))
    await screen.findByRole('heading')

    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent('hi')
    //    expect(screen.getByRole('button')).toBeDisabled()
})
