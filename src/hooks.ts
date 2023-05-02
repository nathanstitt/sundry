import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { Ref, RefObject, RefCallback, MutableRefObject } from 'react'
import { emptyFn, isSSR } from './util.js'
import { RefElementOrNull, CallbackRef, HTMLElementOrNull } from './types.js'
import { themeMediaRules } from './theme.js'
import { useMatchMedia } from './use-match-media.js'

/**
 * Hooks here are an algamation of code from
 *  rooks, beautiful-react-hooks, & react-use
 */

type UseDocumentVisibilityStateReturn = Document['visibilityState'] | null

export function useDocumentVisibilityState(): UseDocumentVisibilityStateReturn {
    const [visibilityState, setVisibilityState] = useState<UseDocumentVisibilityStateReturn>(
        isSSR ? null : document?.visibilityState
    )

    const handleVisibilityChange = useCallback(() => {
        setVisibilityState(isSSR ? null : document?.visibilityState)
    }, [])

    useEventListener('visibilitychange', handleVisibilityChange)

    return visibilityState
}

export interface ACallback<TArgs, TResult = void> {
    (...args: TArgs[]): TResult
}
interface CallbackSetter<TArgs> {
    (nextCallback: ACallback<TArgs>): void
}

export const useValueSetter = <TArgs, TResult = void>(callback?: ACallback<TArgs, TResult>) => {
    const handlerRef = useRef(callback)

    const setHandler = useRef((nextCallback: ACallback<TArgs, TResult>) => {
        if (typeof nextCallback !== 'function') {
            throw new Error(
                "the argument supplied to the 'setHandler' function should be of type function"
            )
        }

        handlerRef.current = nextCallback
    })

    return [handlerRef, setHandler.current] as [
        RefObject<ACallback<TArgs, TResult>>,
        CallbackSetter<TArgs>
    ]
}

export const usePreviousValue = <TValue>(value?: TValue): TValue | undefined => {
    const prevValue = useRef<TValue>()
    useEffect(() => {
        prevValue.current = value
        return () => {
            prevValue.current = undefined
        }
    })
    return prevValue.current
}

interface useEventListenerOptions<T extends Document | Window | HTMLElement>
    extends AddEventListenerOptions {
    target?: T
    useCapture?: boolean
    pause?: boolean
}

type WindowEventHandler<T extends keyof WindowEventMap> = (event: WindowEventMap[T]) => void
type DocumentEventHandler<T extends keyof DocumentEventMap> = (event: DocumentEventMap[T]) => void
type ElementEventHandler<T extends keyof HTMLElementEventMap> = (event: HTMLElementEventMap[T]) => void

export function useEventListener<K extends keyof WindowEventMap, T extends Window>(
    eventName: K,
    handler: WindowEventHandler<K>,
    options?: useEventListenerOptions<T>
): void
export function useEventListener<K extends keyof DocumentEventMap, T extends Document>(
    eventName: K,
    handler: DocumentEventHandler<K>,
    options?: useEventListenerOptions<T>
): void
export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
    eventName: K,
    handler: ElementEventHandler<K>,
    options?: useEventListenerOptions<T>
): void
export function useEventListener<
    K extends keyof DocumentEventMap,
    T extends Document | Window | HTMLElement = Document
>(
    eventName: K,
    handler: EventListenerOrEventListenerObject,
    options: useEventListenerOptions<T> = {}
): void {
    const { pause, target, useCapture, ...remainingOptions } = options
    const listenerOptions = useCapture ? true : remainingOptions
    const element = target || (isSSR ? null : document)

    useEffect(() => {
        if (isSSR || pause || !element) {
            return
        }
        element.addEventListener(eventName, handler, listenerOptions)

        return () => {
            if (element) {
                element.removeEventListener(eventName, handler, listenerOptions)
            }
        }
    }, [eventName, handler, pause, element, listenerOptions])
}

export type PossibleRef<T> = Ref<T> | undefined

function setRef<T>(ref: PossibleRef<T> | null, value: T) {
    if (typeof ref === 'function') {
        ref(value)
    } else if (ref !== null && ref !== undefined) {
        const r = ref as MutableRefObject<T>
        r.current = value
    }
}

export function useForkRef<T>(
    refA: PossibleRef<T> | null,
    refB: PossibleRef<T> | null
): RefCallback<T> | null {
    return useMemo(() => {
        if (refA === null && refB === null) {
            return null
        }

        return (refValue: T) => {
            setRef(refA, refValue)
            setRef(refB, refValue)
        }
    }, [refA, refB])
}

type useRefElementReturn<T> = [(refElement: RefElementOrNull<T>) => void, RefElementOrNull<T>]

type useRefCB<T> = (refElement: RefElementOrNull<T>) => void
export function useRefElement<T>(): useRefElementReturn<T> {
    const [refElement, setRefElement] = useState<RefElementOrNull<T>>(null)
    const ref = useCallback<useRefCB<T>>((element) => setRefElement(element), [])
    return [ref, refElement]
}

export function useOutsideClickRef(
    handler: (event: MouseEvent) => void,
    pause = false
): [CallbackRef] {
    const savedHandler = useRef(handler)

    const [node, setNode] = useState<HTMLElementOrNull>(null)

    const memoizedCallback = useCallback(
        (event: MouseEvent) => {
            if (node && !node.contains(event.target as Element)) {
                savedHandler.current(event)
            }
        },
        [node]
    )

    useEffect(() => {
        savedHandler.current = handler
    })

    const ref = useCallback((nodeElement: HTMLElementOrNull) => {
        setNode(nodeElement)
    }, [])

    useEventListener('click', memoizedCallback, { useCapture: true, pause })
    // windowEventMap lacks ontouchstart :(
    useEventListener('ontouchstart' as any, memoizedCallback, { useCapture: true, pause })

    return [ref]
}

type UseIntervalOptions = {
    pause?: boolean
    immediate?: boolean
}

export function useInterval(
    callback: () => void,
    intervalDurationMs = 0,
    options: UseIntervalOptions = {}
): void {
    const savedRefCallback = useRef<() => void>()
    const wasCalled = useRef(false)
    const { immediate, pause } = options

    useEffect(() => {
        savedRefCallback.current = callback
    })

    function internalCallback() {
        savedRefCallback.current?.()
        wasCalled.current = true
    }

    useEffect(() => {
        if (pause || isSSR) {
            return emptyFn
        }
        if (immediate && !wasCalled.current) {
            internalCallback()
        }
        const interval = window.setInterval(internalCallback, intervalDurationMs)
        return () => window.clearInterval(interval)
    }, [intervalDurationMs, pause, immediate])
}

export function useToggle(initialValue = false) {
    const [isEnabled, setValue] = useState(initialValue)
    const setEnabled = useCallback(() => setValue(true), [setValue])
    const setDisabled = useCallback(() => setValue(false), [setValue])
    const setToggled = useCallback((v: boolean) => setValue(v), [])
    return useMemo(() => ({
        isEnabled,
        setDisabled,
        setEnabled,
        setToggled,
    }),[isEnabled, setDisabled, setEnabled, setToggled])
}

export function useDidMount(callback: typeof emptyFn): void {
    useEffect(() => {
        if (typeof callback === "function") {
            callback();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export function useDeviceSize(defaultSize: keyof typeof themeMediaRules = 'desktop') {
    const [names, queries] = useMemo(() => [Object.keys(themeMediaRules), Object.values(themeMediaRules)], [])
    const sizes = useMatchMedia(queries)
    for (let i = 0; i < sizes.length; i++) {
        if (sizes[i]) return names[i]
    }
    return defaultSize
}
