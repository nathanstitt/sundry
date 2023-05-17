import { configureSundry } from '../src/config.js'

import select, { components } from 'react-select'
import createable from 'react-select/creatable'
import async from 'react-select/async'

configureSundry({
    reactSelect: { select, async, createable, components },
})
//initializeReactSelect()
