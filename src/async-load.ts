import loadable, { LoadableClassComponent, DefaultComponent } from '@loadable/component'
import { retry } from './util.js'
import { FC } from './types.js'

// @loadable/component fails when imported as esm module
const DefaultLoadable = (loadable as any)['default'] || loadable

export type ImportedComponent = LoadableClassComponent<any> | FC<any>

export function asyncComponentLoader<Props>(loader: () => Promise<DefaultComponent<Props>>) {
    return DefaultLoadable(() => retry(loader))
}
