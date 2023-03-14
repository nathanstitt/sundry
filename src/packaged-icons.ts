import exclamationCircle from '@iconify/icons-bi/exclamation-circle-fill.js'
import exclamationTriangle from '@iconify/icons-bi/exclamation-triangle-fill.js'
import thumbsUp from '@iconify/icons-bi/hand-thumbs-up-fill.js'
import xCircle from '@iconify/icons-bi/x-circle.js'
import clock from '@iconify/icons-bi/clock.js'
import close from '@iconify/icons-bi/x-square.js'
import spin from '@iconify/icons-bi/arrow-clockwise.js'
import plusSquare from '@iconify/icons-bi/plus-square.js'
import minusSquare from '@iconify/icons-bi/dash-square.js'
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
