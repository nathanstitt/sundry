import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { emptyFn, isSSR } from './util.js'
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
    if (isSSR) return [initialState as S, emptyFn, emptyFn]

    const [value, setValue] = useState<S>(() => initialize(key, initialState)) // eslint-disable-line react-hooks/rules-of-hooks
    const isUpdateFromCrossDocumentListener = useRef(false)  // eslint-disable-line react-hooks/rules-of-hooks
    const isUpdateFromWithinDocumentListener = useRef(false) // eslint-disable-line react-hooks/rules-of-hooks
    const customEventTypeName = useMemo(() => { // eslint-disable-line react-hooks/rules-of-hooks
        return `sundry-${key}-localstorage-update`
    }, [key])

    useEffect(() => { // eslint-disable-line react-hooks/rules-of-hooks
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

    const listenToCrossDocumentStorageEvents = useCallback( // eslint-disable-line react-hooks/rules-of-hooks
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
    useEventListener('storage', listenToCrossDocumentStorageEvents, { target: window }) // eslint-disable-line react-hooks/rules-of-hooks

    const listenToCustomEventWithinDocument = useCallback( // eslint-disable-line react-hooks/rules-of-hooks
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
    useEventListener(customEventTypeName as any, listenToCustomEventWithinDocument, { // eslint-disable-line react-hooks/rules-of-hooks
        target: document,
    })

    const broadcastValueWithinDocument = useCallback( // eslint-disable-line react-hooks/rules-of-hooks
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
    const set: any = useCallback( // eslint-disable-line react-hooks/rules-of-hooks
        (newValue: S) => {
            isUpdateFromCrossDocumentListener.current = false
            isUpdateFromWithinDocumentListener.current = false
            setValue(newValue)
            broadcastValueWithinDocument(newValue)
            return newValue
        },
        [broadcastValueWithinDocument]
    )

    const remove = useCallback(() => { // eslint-disable-line react-hooks/rules-of-hooks
        localStorage.removeItem(key)
    }, [key])

    return [value, set, remove]
}
