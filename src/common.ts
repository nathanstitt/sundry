import * as React from 'react'
import * as Yup from 'yup'
import { cx, css } from '@emotion/css'
export * from './types'
export * from './util'
export { useIsSSR, useSSRSafeId, SSRProvider } from '@react-aria/ssr'
const { useState, useEffect, useMemo, useContext, useId, useCallback, useLayoutEffect } = React
import _styled, { CSSObject, CreateStyled } from '@emotion/styled'

// emotion/styled has bad cjs export: https://github.com/emotion-js/emotion/issues/2730
let styled = _styled
if ((_styled as any).default) styled = (styled as any).default as any as CreateStyled

export type { CSSObject }
export {
    cx,
    css,
    Yup,
    React,
    useId,
    styled,
    useMemo,
    useState,
    useEffect,
    useContext,
    useCallback,
    useLayoutEffect,
}
