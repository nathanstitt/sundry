import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLocalstorageState } from './use-local-storage.js'
import { useToggle } from './hooks.js'

let useIsExpanded = (id: string, defaultExpanded: boolean) => {
    return useLocalstorageState(id, defaultExpanded)
}

export const setIsExpandedImpl = (fn: typeof useIsExpanded) => {
    useIsExpanded = fn
}

export function useControlledCollapse(isExpanded: boolean, setExpanded: (e: boolean) => void) {
    const { isEnabled: dispayAsExpanded, setToggled: onToggleComplete } = useToggle(isExpanded)
    const ref = useRef<HTMLDivElement>(null)
    const lastExpanded = useRef(isExpanded)

    const firstUpdate = useRef(true)

    useEffect(() => {
        const maskElem = ref?.current

        if (!maskElem) {
            return
        }

        if (firstUpdate.current) {
            maskElem.style.height = isExpanded ? 'auto' : '0px'
            firstUpdate.current = false
            if (!isExpanded) {
                maskElem.style.overflow = 'hidden'
            }

            return
        }

        const iniHeight = isExpanded ? 0 : maskElem.scrollHeight
        const endHeight = isExpanded ? maskElem.scrollHeight : 0

        if (lastExpanded.current === isExpanded) {
            return
        }

        maskElem.ontransitionend = null
        maskElem.style.height = 'auto'
        maskElem.style.height = iniHeight + 'px'

        // only animates if there is a difference ( display none will return always 0)
        if (iniHeight !== endHeight) {
            maskElem.style.overflow = 'hidden'

            // some browsers require a bigger delay to allow transaction animation to occur
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        maskElem.ontransitionend = (e) => {
                            if (e.propertyName === 'height') {
                                maskElem.style.overflow = isExpanded ? 'visible' : 'hidden'
                                lastExpanded.current = isExpanded
                                if (isExpanded) {
                                    maskElem.style.height = 'auto'
                                }
                            }
                            onToggleComplete(isExpanded)
                        }
                        maskElem.style.height = endHeight + 'px'
                    })
                })
            })
        } else {
            maskElem.style.height = isExpanded ? 'auto' : '0px'
        }

        return function () {
            maskElem.ontransitionend = null
        }
    }, [isExpanded, ref, firstUpdate, lastExpanded, onToggleComplete])

    const getCollapseProps = useCallback(
        () => ({
            ref,
            style: {
                transition: 'all .5s',
            },
        }),
        [ref]
    )

    return useMemo(
        () => ({
            getCollapseProps,
            isExpanded,
            setExpanded,
            dispayAsExpanded,
        }),
        [getCollapseProps, setExpanded, isExpanded, dispayAsExpanded]
    )
}

export const useRetainedCollapse = (id: string, defaultExpanded: boolean) => {
    const [isExpanded, setExpanded] = useIsExpanded(id, defaultExpanded)
    return useControlledCollapse(isExpanded, setExpanded)
}

export const useCollapse = (defaultExpanded = true) => {
    const [isExpanded, setExpanded] = useState(defaultExpanded)
    return useControlledCollapse(isExpanded, setExpanded)
}
