import type { WeakValidationMap, FC as RFC, ReactElement, ReactNode, ValidationMap } from 'react'

type EmptyProps = Record<string, unknown>
export type PropsWithChildren<P = EmptyProps> = P & {
    children: ReactNode | ReactNode[] | undefined
}

export type PropsWithOptionalChildren<P = EmptyProps> = P & {
    children?: ReactNode | ReactNode[] | undefined
}
interface FCProperties<P = EmptyProps> {
    propTypes?: WeakValidationMap<P> | undefined
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
}
export type FC<P = EmptyProps> = RFC<P>
export interface FCWOC<P = EmptyProps> extends FCProperties {
    (props: PropsWithOptionalChildren<P>, context?: any): ReactElement<any, any> | null
}
export interface FCWC<P = EmptyProps> extends FCProperties {
    (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null
}
