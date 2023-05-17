
import type StateManagedSelect from 'react-select'
import type AsyncSelect from 'react-select/async'
import type CreatableSelect from 'react-select/creatable'

type ReactSelectConfig = {
    async: AsyncSelect
    createable: CreatableSelect
    select: StateManagedSelect
    components: Record<string, any>
}

export type SundryConfig = {
    reactSelect: ReactSelectConfig | null
    portalContainer: HTMLElement | null
}

let CONFIG: SundryConfig = {
    reactSelect: null,
    portalContainer: null,
}

export const configureSundry = (config: SundryConfig) => {
    CONFIG = { ...CONFIG, ...config }
}

export function getSundryConfig() {
    return CONFIG
}

export function getPortalContainer() {
    return CONFIG.portalContainer || document.body
}
