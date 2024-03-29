import { React, cx, isNil } from './common.js'
import { themeColors as colors } from './theme.js'
import type { ActionMeta, Props as ReactSelectProps, StylesConfig, CSSObjectWithLabel } from 'react-select'
import { getSundryConfig } from './config.js'
//let ReactSelectOption: any = null

// currently it seems to be impossible to import react-select in a way that can be imported in nodejs for SSR
// it will build fine, but the consuming library will fail with errors such as:
// node_modules/react-select/dist/react-select.esm.js:1
// import { u as useStateManager } from './useStateManager-7e1e8489.esm.js';
// ^^^^^^
// rather than compile react-select source into the build, the config workaround was choosen
// the caller sets the needed components



// all of the below methods were attempted.  Leaving them intact so as not to repeat them unnecessarily
//
// what should have worked:
// import ReactSelect, { components, Props as ReactSelectProps, ActionMeta } from 'react-select'
// import ReactSelectCreate from 'react-select/creatable'
// import ReactSelectAsync from 'react-select/async'
// const ReactSelectOption = components.Option

// using async loading with import:
// import { asyncComponentLoader } from './async-load.js'
// const ReactSelectCreate = asyncComponentLoader<ReactSelectProps>(() =>
//     import('react-select/creatable').then((m) => m.default)
// )
// const ReactSelectAsync = asyncComponentLoader<ReactSelectProps>(() =>
//     import('react-select/async').then((m) => m.default)
// )
// const ReactSelect = asyncComponentLoader<ReactSelectProps>(() =>
//     import('react-select').then((m) => m.default)
// )
// const ReactSelectOption = asyncComponentLoader(() =>
//     import('react-select').then((m) => m.components.Option)
// )
//
// hacky import ourselves:
// let ReactSelectCreate: ReactSelect | null = null
// import('react-select/creatable').then((rsc) => (ReactSelectCreate = rsc.default))

// let ReactSelectAsync: ReactSelect | null = null
// import('react-select/async').then((rsc) => (ReactSelectAsync = rsc.default))

export type SelectOptionType = { [key: string]: any }

const DataIdOption = ({ data: _, ...props }: any) => {
    const ReactSelectOption = getSundryConfig().reactSelect?.components.Option
    if (!ReactSelectOption) return null

    return (
        <ReactSelectOption
            {...props}
            innerProps={{
                ...props.innerProps,
                'data-is-selected': !!props.isSelected,
                'data-id': props.value,
            }}
        />
    )
}

const CUSTOM_COMPONENTS = {
    Option: DataIdOption,
}

// https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/styles.js
export const SelectStyles: StylesConfig = {
    container: (provided: CSSObjectWithLabel) => ({
        ...provided,
    }),
    control: (provided: CSSObjectWithLabel) => ({
        ...provided,
        minWidth: '150px',
        background: 'transparent',
        boxShadow: 'none',
    }),
    indicatorSeparator: (provided: CSSObjectWithLabel, props: ReactSelectProps) => ({
        ...provided,
        backgroundColor: props.isDisabled ? 'transparent' : provided.backgroundColor,
    }),
    singleValue: (provided: CSSObjectWithLabel) => ({
        ...provided,
        color: colors.text,
    }),
    multiValueRemove: (provided: CSSObjectWithLabel, state: any) => ({
        ...provided,
        display: state.isDisabled ? 'none' : provided.display,
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel, state: any) => ({
        ...provided,
        color: state.isDisabled ? 'transparent' : provided.color,
    }),
    menu: (provided: CSSObjectWithLabel) => ({
        ...provided,
        backgroundColor: 'white',
        zIndex: 5,
    }),
    placeholder: (provided: CSSObjectWithLabel) => ({
        ...provided,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    }),
    valueContainer: (provided: CSSObjectWithLabel, { selectProps: { wrapDisplayedLabels } }: any) => ({
        ...provided,
        flexWrap: wrapDisplayedLabels ? 'wrap' : 'nowrap',
    })

}

export const SelectSmallStyles:StylesConfig = {
    ...SelectStyles,

    control: (provided: CSSObjectWithLabel, state: any) => {
        const base = SelectStyles.control?.(provided, state) || provided
        return {
            ...base,
            background: '#fff',
            borderColor: colors.input.border,
            minHeight: '30px',
            height: '30px',
            minWidth: '80px',
        } as CSSObjectWithLabel
    },
    valueContainer: (provided: CSSObjectWithLabel) => ({
        ...provided,
        flexWrap: 'nowrap',
        height: '30px',
        padding: '0 6px',
    }),
    input: (provided: CSSObjectWithLabel) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    multiValueLabel: (provided: CSSObjectWithLabel) => ({
        ...provided,
        padding: 0,
        fontSize: '70%',
    }),
    indicatorsContainer: (provided: CSSObjectWithLabel) => ({
        ...provided,
        height: '30px',
        padding: 0,
    }),
    dropdownIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        padding: 2,
    }),
    clearIndicator: (provided: CSSObjectWithLabel) => ({
        ...provided,
        padding: 2,
    }),
}

export const SelectTinyStyles: StylesConfig = {
    ...SelectSmallStyles,
    control: (provided: CSSObjectWithLabel, state: any) => {
        const base = SelectStyles.control?.(provided, state) || provided
        return {
            ...base,
            minHeight: '30px',
            height: '30px',
            minWidth: '80px',
        } as CSSObjectWithLabel
    },
}

export type SelectValue = Array<string | number> | string | number
export type SelectOption = { label: string; value: string | number } | null
export type SelectOptions = Array<SelectOption>
export type SelectOnChangeHandler = (
    value: null | SelectValue,
    option: SelectOption,
    meta: ActionMeta<SelectOptionType>
) => void | SelectValue

const optionForValue = (value: SelectValue | null | undefined, options: SelectOptions) => {
    if (isNil(value)) return null
    const v = Array.isArray(value)
        ? options.filter((o) => o && value.includes(o.value))
        : options.find((o) => o?.value === value)

    return isNil(v) ? null : v
}
type RSChangeH = (option: SelectOption, meta: ActionMeta<SelectOptionType>) => void

export type SelectLoadOptionsFn = (inputValue: string) => Promise<SelectOptions>

export interface SelectProps<O extends SelectOption = SelectOption>
    extends Omit<ReactSelectProps, 'isMulti' | 'onChange' | 'name'> {
    defaultValue?: SelectValue | null | undefined
    onCreateOption?: (value: string) => void
    value?: SelectValue
    isMulti?: boolean
    wrapDisplayedLabels?: boolean
    isClearable?: boolean
    cacheOptions?: boolean
    options: Array<O>
    onChange?: SelectOnChangeHandler
    small?: boolean
    tiny?: boolean
    allowCreate?: boolean
    className?: string
    name?: string
    loadOptions?: SelectLoadOptionsFn
    innerRef?: React.RefCallback<HTMLInputElement>
}
export function Select<O extends SelectOption = SelectOption>({
    small,
    tiny,
    defaultValue,
    value,
    onChange,
    options,
    styles,
    className,
    allowCreate,
    onCreateOption,
    loadOptions,
    innerRef,
    ...props
}: SelectProps<O>) {
    const onChangeHandler = React.useMemo<RSChangeH | null>(() => {
        if (!onChange) return null

        return (option: SelectOption, meta: ActionMeta<SelectOptionType>) => {
            if (option) {
                const value = Array.isArray(option) ? option.map((o) => o?.value) : option.value
                onChange(value, option, meta)
            } else {
                onChange(props.isMulti ? [] : null, option, meta)
            }
        }
    }, [onChange, props.isMulti])

    const config = getSundryConfig().reactSelect
    if (!config) return null

    let S: any // FC<ReactSelectProps | CreatableProps<any, any, any> | AsyncProps<any, any, any>>
    if (allowCreate) {
        S = config.createable
    } else if (loadOptions) {
        S = config.async
    } else {
        S = config.select
    }
    if (!S) return null

    return (
        <S
            ref={innerRef}
            components={config.components.Option ? CUSTOM_COMPONENTS : undefined}
            selectProps={{}}
            className={cx('select', className, {
                'has-options': !!loadOptions || options.length > 0,
            })}
            options={options}
            loadOptions={loadOptions}
            styles={styles ? styles : tiny ? SelectTinyStyles : small ? SelectSmallStyles : SelectStyles}
            {...props}
            defaultOptions={loadOptions ? options : undefined}
            onCreateOption={onCreateOption}
            value={optionForValue(value, options)}
            defaultValue={optionForValue(defaultValue, options)}
            onChange={onChangeHandler}
        />
    )
}
