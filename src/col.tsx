import { React, FC, FCWC, cx, omit } from './common.js'
import { Box, BoxProps } from 'boxible'

type Sizes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ColProps extends BoxProps {
    className?: string
    auto?: boolean
    size?: Sizes
    sm?: Sizes
    md?: Sizes
    lg?: Sizes
    xl?: Sizes
    xxl?: Sizes
    fluid?: boolean
    offset?: {
        xs?: Sizes
        sm?: Sizes
        md?: Sizes
        lg?: Sizes
        xl?: Sizes
        xxl?: Sizes
    }
}

export function omitColSizeProps(props: Record<string,any>) {
    return omit(props, 'auto', 'size', 'sm', 'md', 'lg', 'xl', 'xxl', 'fluid', 'offset')
}

export const Col: FCWC<ColProps> = ({
    children,
    auto,
    size,
    sm,
    md,
    lg,
    xl,
    xxl,
    fluid,
    className,
    offset = {},
    ...props
}) => {

    return (
        <Box
            className={cx(className, {
                col: auto,
                [`col-${size}`]: !!size,
                [`col-sm-${sm}`]: !!sm,
                [`col-md-${md}`]: !!md,
                [`col-lg-${lg}`]: !!lg,
                [`col-xl-${xl}`]: !!xl,
                [`col-xxl-${xxl}`]: !!xxl,
                'col-fluid': !!fluid,
                [`offset-xs-${offset.sm}`]: !!offset.xs,
                [`offset-sm-${offset.sm}`]: !!offset.sm,
                [`offset-md-${offset.md}`]: !!offset.md,
                [`offset-lg-${offset.lg}`]: !!offset.lg,
                [`offset-xl-${offset.xl}`]: !!offset.xl,
                [`offset-xxl-${offset.xxl}`]: !!offset.xxl,
            })}
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

export const RowBreak:FC<RowBreakProps> = ({
    className,
    only,
}) => (
    <div className={cx('w-100', className, {
        'd-none': !!only,
        [`d-${only}-block`]: !!only
    })} />
)
