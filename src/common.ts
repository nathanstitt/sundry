import * as React from 'react'
import type { WeakValidationMap, FC as RFC, ReactElement, ReactNode, ValidationMap } from 'react'
import { Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { dayjs } from './date'
import { cx, css } from '@emotion/css'

const {
    Component,
    createRef,
    useState,
    useRef,
    useLayoutEffect,
    useEffect,
    useMemo,
    useContext,
    useCallback,
} = React

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

//
// namespace React {
//     /** Fixes React 18 compatibility issues with formik: https://github.com/jaredpalmer/formik/issues/3546#issuecomment-1127014775 */
//     type StatelessComponent<P> = FunctionComponent<P>; // eslint-disable-line
// }

// type React.StatelessComponent<P> = FC<P>; // eslint-disable-line

export {
    cx,
    css,
    Yup,
    React,
    dayjs,
    Formik,
    useRef,
    useMemo,
    useState,
    createRef,
    useEffect,
    Component,
    useContext,
    useCallback,
    useLayoutEffect,
}

export type { FormikHelpers }
