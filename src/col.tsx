import { React, FC, FCWC, cx, omit, pick } from './common.js'
import { Box, BoxProps } from 'boxible'
import { isNil } from './util.js'

export type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type ColumnBreakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export interface ColProps extends BoxProps {
    className?: string
    auto?: boolean
    size?: ColumnSize
    sm?: ColumnSize
    md?: ColumnSize
    lg?: ColumnSize
    xl?: ColumnSize
    xxl?: ColumnSize
    fluid?: boolean
    order?: ColumnSize | Partial<Record<ColumnBreakpoints, ColumnSize>>
    offset?: ColumnSize | Partial<Record<ColumnBreakpoints, ColumnSize>>
}


export const colSizePropNames = ['auto', 'size', 'sm', 'md', 'lg', 'xl', 'xxl', 'fluid', 'offset', 'order']

export function omitColSizeProps(props: Record<string,any>) {
    return omit(props, colSizePropNames)
}

export function extractColSizeProps(props: Record<string,any>) {
    return pick(props, colSizePropNames) as ColProps
}

const objectOrValueSizes = (prop: 'order' | 'offset', value?: ColumnSize | Partial<Record<ColumnBreakpoints, ColumnSize>>) => {
    const cls:Array<string> = []
    if (typeof value === 'object') {
        for (const [name, size] of Object.entries(value)) {
            cls.push(`${prop}-${name}-${size}`)
        }
    } else if (!isNil(value)) {
        cls.push(`${prop}-${value}`)
    }
    return cls
}

export const Col: FCWC<ColProps> = ({
    children,
    auto,
    sm,
    md,
    lg,
    xl,
    xxl,
    fluid,
    size,
    order,
    className,
    offset,
    ...props
}) => {
    return (
        <Box
            className={cx(
                className,
                ...objectOrValueSizes('offset', offset),
                ...objectOrValueSizes('order', order),
                {
                    col: auto,
                    [`col-${size}`]: !!size,
                    [`col-sm-${sm}`]: !!sm,
                    [`col-md-${md}`]: !!md,
                    [`col-lg-${lg}`]: !!lg,
                    [`col-xl-${xl}`]: !!xl,
                    [`col-xxl-${xxl}`]: !!xxl,
                    'col-fluid': !!fluid,
                },
            )}
            direction="column"
            {...props}
        >
            {children}
        </Box>
    )
}

export interface RowProps {
    className?: string
}

export const Row: FCWC<RowProps> = ({ children, className }) => {
    return <div className={cx('row', className)}>{children}</div>
}
interface RowBreakProps {
    className?: string
    only?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

export const RowBreak: FC<RowBreakProps> = ({ className, only }) => (
    <div
        className={cx('w-100', className, {
            'd-none': !!only,
            [`d-${only}-block`]: !!only,
        })}
    />
)
