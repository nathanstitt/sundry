import { React, FC, cx, isNil } from './common'
import { themeColors as colors } from './theme'
import ReactSelect, { components, Props as ReactSelectProps, ActionMeta } from 'react-select'
import ReactSelectCreate from 'react-select/creatable'
import ReactSelectAsync from 'react-select/async'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
export type SelectOptionType = { [key: string]: any }

const SharedCache = createCache({ nonce: 'MCSPOT_REACT_SELECT_NONCE', key: 'ab-react-select' })

const RSOption = components.Option as any

const DataIdOption = ({ data, ...props }: any) => {
    return (
        <RSOption
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
const stdStyles = {
    container: (provided: any) => ({
        ...provided,
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        minWidth: '150px',
        background: 'transparent',
        boxShadow: state.isFocused ? null : null,
    }),
    indicatorSeparator: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isDisabled ? 'transparent' : provided.backgroundColor,
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: colors.text,
    }),
    multiValueRemove: (provided: any, state: any) => ({
        ...provided,
        display: state.isDisabled ? 'none' : provided.display,
    }),
    dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: state.isDisabled ? 'transparent' : provided.color,
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: 'white',
        zIndex: 5,
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        flexWrap: 'no-wrap',
    }),
}

const smallStyles = {
    ...stdStyles,

    control: (provided: any, state: any) => {
        const base = stdStyles.control(provided, state)
        return {
            ...base,
            background: '#fff',
            borderColor: colors.input.border,
            minHeight: '30px',
            height: '30px',
            minWidth: '80px',
            boxShadow: state.isFocused ? null : null,
        }
    },

    valueContainer: (provided: any) => ({
        ...provided,
        flexWrap: 'no-wrap',
        height: '30px',
        padding: '0 6px',
    }),
    input: (provided: any) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        padding: 0,
        fontSize: '70%',
    }),
    indicatorsContainer: (provided: any) => ({
        ...provided,
        height: '30px',
        padding: 0,
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: 2,
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        padding: 2,
    }),
}

const tinyStyles = {
    ...smallStyles,
    control: (provided: any, state: any) => {
        const base = smallStyles.control(provided, state)
        return {
            ...base,
            minHeight: '30px',
            height: '30px',
            minWidth: '80px',
            boxShadow: state.isFocused ? null : null,
        }
    },
}

export type SelectValue = Array<string | number> | string | number
export type SelectOption = { label: string; value: string | number } | null
export type SelectOptions = { label?: string; value: string | number }[]

const optionForValue = (value: SelectValue | undefined, options: SelectOptions) => {
    if (isNil(value)) return null
    const v = Array.isArray(value)
        ? options.filter((o) => o && value.includes(o.value))
        : options.find((o) => o?.value === value)

    return isNil(v) ? null : v
}

export type SelectLoadOptionsFn = (inputValue: string) => Promise<SelectOptions>

export interface SelectProps extends Omit<ReactSelectProps, 'isMulti' | 'onChange' | 'name'> {
    defaultValue?: SelectValue
    onCreateOption?: (value: string) => void
    value?: SelectValue
    isMulti?: boolean
    isClearable?: boolean
    cacheOptions?: boolean
    options: SelectOptions
    onChange?(
        value: null | SelectValue,
        option: SelectOption,
        meta: ActionMeta<SelectOptionType>
    ): void
    small?: boolean
    tiny?: boolean
    allowCreate?: boolean
    className?: string
    name?: string
    loadOptions?: SelectLoadOptionsFn
    innerRef?: React.RefCallback<HTMLInputElement>
}

export const Select: FC<SelectProps> = ({
    small,
    tiny,
    defaultValue,
    value,
    onChange,
    options,
    className,
    allowCreate,
    onCreateOption,
    loadOptions,
    innerRef,
    ...props
}) => {
    const onChangeHandler = onChange
        ? (option: SelectOption, meta: ActionMeta<SelectOptionType>) => {
              if (option) {
                  const value = Array.isArray(option) ? option.map((o) => o?.value) : option.value
                  onChange(value, option, meta)
              } else {
                  onChange(props.isMulti ? [] : null, option, meta)
              }
          }
        : null

    let S: any // FC<ReactSelectProps | CreatableProps<any, any, any> | AsyncProps<any, any, any>>
    if (allowCreate) {
        S = ReactSelectCreate
    } else if (loadOptions) {
        S = ReactSelectAsync
    } else {
        S = ReactSelect
    }

    return (
        <CacheProvider value={SharedCache}>
            <S
                ref={innerRef}
                components={CUSTOM_COMPONENTS}
                selectProps={{}}
                className={cx('select', className, {
                    'has-options': !!loadOptions || options.length > 0,
                })}
                options={options}
                loadOptions={loadOptions}
                styles={tiny ? tinyStyles : small ? smallStyles : stdStyles}
                {...props}
                defaultOptions={loadOptions ? options : undefined}
                onCreateOption={onCreateOption}
                value={optionForValue(value, options)}
                defaultValue={optionForValue(defaultValue, options)}
                onChange={onChangeHandler}
            />
        </CacheProvider>
    )
}
