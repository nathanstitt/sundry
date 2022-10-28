// import { DefaultTheme } from '@emotion/styled';

const colors = {
    primary: '#3865B1',
    primaryLite: '#828FBB',
    secondary: '#E6F4F1',
    secondaryLite: '#F4F9FF',
    border: '#284770',
    tableStripe: '#e8e8e8',
    well: '#fafafa',

    input: { border: '#ced4da' },
    line: '#cfcfcf',
    inactive: '#b3b3b3',
    active: '#10161a',
    activeLink: '#0048c0',
    hoveredLink: '#2d518e',
    subtleLine: '#e0e6ee',
    danger: '#a82a2a', // red1

    dropHover: '#d1d1d1',
    rowHover: '#e1e8ed',
    buttonIcon: '#738694',
    buttonIconHover: '#182026',

    folder: '#d5b63b',
    hoveredFolder: '#f0cc3f',

    text: '#212529',
    lightText: '#5f676f',
    textHover: '#4e4e4e',

    black: '#10161a',

    blue1: '#0e5a8a',
    blue2: '#106ba3',
    blue3: '#137cbd',
    blue4: '#2b95d6',
    blue5: '#48aff0',

    cobalt1: '#1f4b99',
    cobalt2: '#2458b3',
    cobalt3: '#2965cc',
    cobalt4: '#4580e6',
    cobalt5: '#669eff',

    dark_gray1: '#182026',
    dark_gray2: '#202b33',
    dark_gray3: '#293742',
    dark_gray4: '#30404d',
    dark_gray5: '#394b59',

    forest1: '#1d7324',
    forest2: '#238c2c',
    forest3: '#29a634',
    forest4: '#43bf4d',
    forest5: '#62d96b',

    gold1: '#a67908',
    gold2: '#bf8c0a',
    gold3: '#d99e0b',
    gold4: '#f2b824',
    gold5: '#ffc940',

    gray1: '#5c7080',
    gray2: '#738694',
    gray3: '#8a9ba8',
    gray4: '#a7b6c2',
    gray5: '#bfccd6',

    green1: '#0a6640',
    green2: '#0d8050',
    green3: '#0f9960',
    green4: '#15b371',
    green5: '#3dcc91',

    indigo1: '#5642a6',
    indigo2: '#634dbf',
    indigo3: '#7157d9',
    indigo4: '#9179f2',
    indigo5: '#ad99ff',

    light_gray1: '#ced9e0',
    light_gray2: '#d8e1e8',
    light_gray3: '#e1e8ed',
    light_gray4: '#ebf1f5',
    light_gray5: '#f5f8fa',

    lime1: '#728c23',
    lime2: '#87a629',
    lime3: '#9bbf30',
    lime4: '#b6d94c',
    lime5: '#d1f26d',

    orange1: '#a66321',
    orange2: '#bf7326',
    orange3: '#d9822b',
    orange4: '#f29d49',
    orange5: '#ffb366',

    red1: '#a82a2a',
    red2: '#c23030',
    red3: '#db3737',
    red4: '#f55656',
    red5: '#ff7373',

    rose1: '#a82255',
    rose2: '#c22762',
    rose3: '#db2c6f',
    rose4: '#f5498b',
    rose5: '#ff66a1',

    sepia1: '#63411e',
    sepia2: '#7d5125',
    sepia3: '#96622d',
    sepia4: '#b07b46',
    sepia5: '#c99765',

    turquoise1: '#008075',
    turquoise2: '#00998c',
    turquoise3: '#00b3a4',
    turquoise4: '#14ccbd',
    turquoise5: '#2ee6d6',

    vermilion1: '#9e2b0e',
    vermilion2: '#b83211',
    vermilion3: '#d13913',
    vermilion4: '#eb532d',
    vermilion5: '#ff6e4a',

    violet1: '#5c255c',
    violet2: '#752f75',
    violet3: '#8f398f',
    violet4: '#a854a8',
    violet5: '#c274c2',

    white: '#ffffff',
}

export const screenSizes = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
}

export const dimensions = {
    navbarBottom: 60,
}

type BreakPointKey = keyof typeof screenSizes

export const breakpoint = {
    larger(size: BreakPointKey) {
        return `@media (min-width: ${screenSizes[size]}px)`
    },
    smaller(size: BreakPointKey) {
        return `@media (max-width: ${screenSizes[size]}px)`
    },
}

export const media = {
    mobile: `@media (max-width: ${screenSizes['md']}px)`,
    tablet: `@media (min-width: ${screenSizes['md']}px) and (max-width: ${screenSizes['xl']}px)`,
    desktop: `@media (min-width: ${screenSizes['xl']}px)`,
}

const makeLine = (side: string) => ({
    [`border${side}`]: `1px solid ${colors.line}`,
    [`margin${side}`]: '1rem',
    [`padding${side}`]: '1rem',
})

const Theme = {
    colors,
    media,
    breakpoint,
    dimensions,
    line: `1px solid ${colors.line}`,
    subtleBorder: `1px solid ${colors.line}`,
    css: {
        topLine: makeLine('Top'),
        bottomLine: makeLine('Bottom'),
        box: {
            border: `1px solid ${colors.line}`,
            padding: '1rem',
        },
    },
    sizes: {
        gap: {
            small: '.5rem',
            default: '1rem',
            medium: '1.5rem',
            large: '2rem',
        },
        edge: {
            small: '.2rem',
            default: '.5rem',
            medium: '.8rem',
            large: '1rem',
        },
    },
}

type ThemeT = typeof Theme

interface ThemeI {
    theme: ThemeT
}

export type { ThemeT, ThemeI }
export { Theme, colors }
