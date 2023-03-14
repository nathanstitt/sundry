import exclamationCircle from '@iconify/icons-bi/exclamation-circle-fill'
import exclamationTriangle from '@iconify/icons-bi/exclamation-triangle-fill'
import thumbsUp from '@iconify/icons-bi/hand-thumbs-up-fill'
import xCircle from '@iconify/icons-bi/x-circle'
import clock from '@iconify/icons-bi/clock'
import close from '@iconify/icons-bi/x-square'
import spin from '@iconify/icons-bi/arrow-clockwise'
import plusSquare from '@iconify/icons-bi/plus-square'
import minusSquare from '@iconify/icons-bi/dash-square'
import xSimple from '@iconify/icons-bi/x'

import type { IconifyIcon } from '@iconify/react'

const cancel = xCircle

export let ICON_DEFINITIONS = {
    thumbsUp,
    exclamationCircle,
    exclamationTriangle,
    cancel,
    clock,
    xCircle,
    spin,
    close,
    plusSquare,
    minusSquare,
    xSimple,
}

type IconTypes<Type> = {
    [Property in keyof Type]: IconifyIcon
}

export function setSundryIcons(icons: IconTypes<typeof ICON_DEFINITIONS>) {
    ICON_DEFINITIONS = icons
}
