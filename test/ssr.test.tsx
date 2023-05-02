import { renderToString } from 'react-dom/server'
import * as React from 'react'
import Demo from '../demo'
import { test, expect, } from 'vitest'

test('render to string', async () => {
    const html = renderToString(<Demo />)
    expect(html).toContain('Hello World')
    expect(html).toMatchSnapshot()
})
