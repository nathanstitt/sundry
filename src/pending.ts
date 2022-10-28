import { useEffect, useState } from 'react'

const PENDING_DELAY = 150 // ms

export const usePendingState = (isEnabled = true, delay = PENDING_DELAY) => {
    const [isPending, setPending] = useState<boolean>(false)
    useEffect(() => {
        if (isEnabled) {
            const timer = setTimeout(() => {
                setPending(true)
            }, delay)
            return () => {
                clearTimeout(timer)
            }
        } else {
            setPending(false)
            return undefined
        }
    }, [isEnabled, delay])
    return isPending
}
