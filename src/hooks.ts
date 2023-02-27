import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { Ref, RefObject, RefCallback, MutableRefObject } from 'react'
import { isSSR } from './util'
import { RefElementOrNull, CallbackRef, HTMLElementOrNull } from './types'

/**
 * Hooks here are an algamation of code from
 *  rooks, beautiful-react-hooks, & react-use
 */

type UseDocumentVisibilityStateReturn = Document['visibilityState'] | null

export function useDocumentVisibilityState(): UseDocumentVisibilityStateReturn {
    const [visibilityState, setVisibilityState] = useState<UseDocumentVisibilityStateReturn>(
        isSSR ? null : global.document?.visibilityState
    )

    const handleVisibilityChange = useCallback(() => {
        setVisibilityState(isSSR ? null : global.document?.visibilityState)
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
type ElementEventHandler<T extends keyof HTMLElementEventMap> = HTMLElementEventMap[T]

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
    const element = target || isSSR ? null : document

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

export function useRefElement<T>(): useRefElementReturn<T> {
    const [refElement, setRefElement] = useState<RefElementOrNull<T>>(null)
    const ref = useCallback<(refElement: RefElementOrNull<T>) => void>(
        (element: RefElementOrNull<T>) => {
            setRefElement(element)
        },
        []
    )

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
