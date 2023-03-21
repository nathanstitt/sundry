import loadable, { LoadableClassComponent, DefaultComponent } from '@loadable/component'
import { retry } from './util.js'
import { FC } from './types.js'

export type ImportedComponent = LoadableClassComponent<any> | FC<any>

export function asyncComponentLoader<Props>(loader: () => Promise<DefaultComponent<Props>>) {
    return loadable(() => retry(loader))
}
