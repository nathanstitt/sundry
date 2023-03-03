import { renderHook } from '@testing-library/react-hooks'
import { useState } from 'react'
import { act, cleanup } from '@testing-library/react'
import { useInterval } from '../src/hooks.js'

import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest'

// const { act } = TestRenderer;
type UseHook = (
    when: boolean,
    eager?: boolean
) => {
    currentValue: number
}
describe('useIntervalWhen', () => {
    let useHook: UseHook = () => ({
        currentValue: 5,
    })

    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(global, 'setInterval')

        useHook = function (pause: boolean, eager = false) {
            const [currentValue, setCurrentValue] = useState(0)
            function increment() {
                setCurrentValue(currentValue + 1)
            }

            useInterval(
                () => {
                    increment()
                },
                1_000,
                { immediate: eager, pause }
            )

            return { currentValue }
        }
    })

    afterEach(() => {
        cleanup()
        vi.useRealTimers()
        vi.clearAllTimers()
    })

    it('should start timer when started with start function', () => {
        expect.hasAssertions()
        vi.useFakeTimers()
        const { result } = renderHook(() => useHook(false))
        void act(() => {
            vi.advanceTimersByTime(1_000)
        })
        expect(setInterval).toHaveBeenCalledTimes(1)
        expect(result.current.currentValue).toBe(1)
        vi.useRealTimers()
    })

    it.only('should call the callback eagerly', () => {
        expect.hasAssertions()
        vi.useFakeTimers()
        const { result } = renderHook(() => useHook(false, true))
        // The value was already incremented because we use useIntervalWhen in EAGER mode
        expect(result.current.currentValue).toBe(1)
        // render again, should not increment
        renderHook(() => useHook(false, true))
        expect(result.current.currentValue).toBe(1)

        void act(() => {
            vi.advanceTimersByTime(1_000)
        })
        expect(setInterval).toHaveBeenCalledTimes(2)

        // The value was incremented twice: one time by the setInterval and one time due to the EAGER
        expect(result.current.currentValue).toBe(2)
        vi.useRealTimers()
    })
})
