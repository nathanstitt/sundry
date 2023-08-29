import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { isSSR } from './util.js'
import { useEventListener } from './hooks.js'

// https://github.com/imbhargav5/rooks/blob/main/packages/rooks/src/hooks/useLocalstorageState.ts

// Gets value from localstorage
function getValueFromLocalStorage(key: string) {
    if (typeof localStorage === 'undefined') {
        return null
    }

    const storedValue = localStorage.getItem(key) ?? 'null'
    try {
        return JSON.parse(storedValue)
    } catch (error) {
        console.error(error)
    }

    return storedValue
}

// Saves value to localstorage
function saveValueToLocalStorage<S>(key: string, value: S) {
    if (typeof localStorage === 'undefined') {
        return null
    }

    return localStorage.setItem(key, JSON.stringify(value))
}

function initialize<S>(key: string, initialState?: SetStateAction<S>) {
    const valueLoadedFromLocalStorage = getValueFromLocalStorage(key)
    if (valueLoadedFromLocalStorage === null) {
        return initialState
    } else {
        return valueLoadedFromLocalStorage
    }
}

type UseLocalstorageStateReturnValue<S> = [S, Dispatch<SetStateAction<S>>, () => void]
type BroadcastCustomEvent<S> = CustomEvent<{ newValue: S }>

export function useLocalstorageState<S>(
    key: string,
    initialState?: S | (() => S)
): UseLocalstorageStateReturnValue<S> {
    if (isSSR) return [initialState as S, () => {}, () => {}]

    const [value, setValue] = useState<S>(() => initialize(key, initialState))
    const isUpdateFromCrossDocumentListener = useRef(false)
    const isUpdateFromWithinDocumentListener = useRef(false)
    const customEventTypeName = useMemo(() => {
        return `sundry-${key}-localstorage-update`
    }, [key])

    useEffect(() => {
        /**
         * We need to ensure there is no loop of
         * storage events fired. Hence we are using a ref
         * to keep track of whether setValue is from another
         * storage event
         */
        if (
            !isUpdateFromCrossDocumentListener.current ||
            !isUpdateFromWithinDocumentListener.current
        ) {
            saveValueToLocalStorage<S>(key, value)
        }
    }, [key, value])

    const listenToCrossDocumentStorageEvents = useCallback(
        (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
                try {
                    isUpdateFromCrossDocumentListener.current = true
                    const newValue = JSON.parse(event.newValue ?? 'null')
                    if (value !== newValue) {
                        setValue(newValue)
                    }
                } catch (error) {
                    console.warn(error)
                }
            }
        },
        [key, value]
    )
    useEventListener('storage', listenToCrossDocumentStorageEvents, { target: window })

    const listenToCustomEventWithinDocument = useCallback(
        (event: BroadcastCustomEvent<S>) => {
            try {
                isUpdateFromWithinDocumentListener.current = true
                const { newValue } = event.detail
                if (value !== newValue) {
                    setValue(newValue)
                }
            } catch (error) {
                console.warn(error)
            }
        },
        [value]
    )
    useEventListener(customEventTypeName as any, listenToCustomEventWithinDocument, {
        target: document,
    })

    const broadcastValueWithinDocument = useCallback(
        function (newValue: S) {
            const event: BroadcastCustomEvent<S> = new CustomEvent(customEventTypeName, {
                detail: { newValue },
            })
            document.dispatchEvent(event)
        },
        [customEventTypeName]
    )

    // any is to work around:
    // 'S' could be instantiated with an arbitrary type which could be unrelated to 'SetStateAction<S>
    const set: any = useCallback(
        (newValue: S) => {
            isUpdateFromCrossDocumentListener.current = false
            isUpdateFromWithinDocumentListener.current = false
            setValue(newValue)
            broadcastValueWithinDocument(newValue)
            return newValue
        },
        [broadcastValueWithinDocument]
    )

    const remove = useCallback(() => {
        localStorage.removeItem(key)
    }, [key])

    return [value, set, remove]
}
