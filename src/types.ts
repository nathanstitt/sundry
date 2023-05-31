import type { WeakValidationMap, FC as RFC, ReactElement, ReactNode, ValidationMap } from 'react'

type EmptyProps = Record<string, unknown>
export type PropsWithChildren<P = EmptyProps> = P & {
    children: ReactNode | ReactNode[] | undefined
}

interface GraphQLError extends Error {
    originalError?: Error
    extensions: Record<string, unknown>
}
// copy definition of CombinedError type from urql vs importing it
export interface CombinedError extends Error {
    name: string;
    message: string;
    graphQLErrors: GraphQLError[];
    networkError?: Error;
    response?: any;
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

export type GenericErrorObject = {
    message: string
    error: true
}
export type ErrorTypes =
    | CombinedError
    | GenericErrorObject
    | Error
    | string
    | false
    | null
    | undefined

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue>

export type RefElementOrNull<T> = T | null

export type HTMLElementOrNull = HTMLElement | null

export type CallbackRef<T extends HTMLElement | null = HTMLElementOrNull> = (node: T) => void

export type Required<T> = {
    [P in keyof T]-?: T[P]
}

export type RequiredParameters<F extends (...args: any) => any> = F extends (
    ...args: infer A
) => any
    ? Required<A>
    : never

export type NonUndefined<A> = A extends undefined ? never : A
