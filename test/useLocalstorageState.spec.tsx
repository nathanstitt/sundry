/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, cleanup, getByTestId, fireEvent, act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import { useLocalstorageState } from '../src/use-local-storage.js'

describe('useLocalstorageState defined', () => {
    it('should be defined', () => {
        expect.hasAssertions()
        expect(useLocalstorageState).toBeDefined()
    })
})

describe('useLocalstorageState basic', () => {
    let App = () => <div />
    beforeEach(() => {
        // firstCallback = jest.fn()
        App = () => {
            const [value, set, remove] = useLocalstorageState('test-value', 'hello')

            return (
                <div data-testid="container">
                    <p data-testid="value">{value}</p>
                    <button
                        data-testid="new-value"
                        onClick={() => {
                            set('new value')
                        }}
                        type="button"
                    >
                        Set to new value
                    </button>
                    <button data-testid="unset-value" onClick={remove} type="button">
                        Unset the value
                    </button>
                </div>
            )
        }
        // end
    })

    afterEach(cleanup)

    it('memo', () => {
        expect.hasAssertions()
        const { result, rerender } = renderHook(() => useLocalstorageState('key1', 'value'))
        // test memo
        const setBeforeRerender = result.current[1]
        const removeBeforeRerender = result.current[2]
        rerender()
        const setAfterRerender = result.current[1]
        const removeAfterRerender = result.current[2]
        expect(setBeforeRerender).toBe(setAfterRerender)
        expect(removeBeforeRerender).toBe(removeAfterRerender)
    })

    it('initializes correctly', () => {
        expect.hasAssertions()
        const { container } = render(<App />)
        const valueElement = getByTestId(container as HTMLElement, 'value')
        expect(valueElement.innerHTML).toBe('hello')
    })

    it('setting the new value', () => {
        expect.hasAssertions()
        const { container } = render(<App />)
        const setToNewValueButton = getByTestId(container as HTMLElement, 'new-value')
        act(() => {
            fireEvent.click(setToNewValueButton)
        })
        const valueElement = getByTestId(container as HTMLElement, 'value')
        expect(valueElement.innerHTML).toBe('new value')
    })

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('unsetting the value', () => {
        expect.hasAssertions()
        const { container } = render(<App />)
        const unsetValueButton = getByTestId(container as HTMLElement, 'unset-value')
        act(() => {
            fireEvent.click(unsetValueButton)
        })
        const valueElement = getByTestId(container as HTMLElement, 'value')
        expect(valueElement.innerHTML).toBe('')
    })
})
