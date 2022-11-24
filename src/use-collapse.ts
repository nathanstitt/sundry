import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLocalstorageState } from 'rooks'

let useIsExpanded = (id: string, defaultExpanded: boolean) => {
    return useLocalstorageState(id, defaultExpanded)
}

export const setIsExpandedImpl = (fn: typeof useIsExpanded) => {
    useIsExpanded = fn
}

function _useCollapse(isExpanded: boolean, setExpanded: (e: boolean) => void) {
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
                            }
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
    }, [isExpanded, ref, firstUpdate, lastExpanded])

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
        }),
        [getCollapseProps, setExpanded, isExpanded]
    )
}

export const useRetainedCollapse = (id: string, defaultExpanded: boolean) => {
    const [isExpanded, setExpanded] = useIsExpanded(id, defaultExpanded)
    return _useCollapse(isExpanded, setExpanded)
}

export const useCollapse = (defaultExpanded = true) => {
    const [isExpanded, setExpanded] = useState(defaultExpanded)
    return _useCollapse(isExpanded, setExpanded)
}
