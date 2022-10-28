import { React, FCWC, cx } from './common'

export interface ColProps {
    className?: string
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
    fluid?: boolean
    offset?: {
        sm?: number
        md?: number
        lg?: number
        xl?: number
        xxl?: number
    }
}

export const Col: FCWC<ColProps> = ({
    children,
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
        <div
            className={cx(className, {
                [`col-sm-${sm}`]: !!sm,
                [`col-md-${md}`]: !!md,
                [`col-lg-${lg}`]: !!lg,
                [`col-xl-${xl}`]: !!xl,
                [`col-xxl-${xxl}`]: !!xxl,
                'col-fluid': !!fluid,
                [`offset-sm-${offset.sm}`]: !!offset.sm,
                [`offset-md-${offset.md}`]: !!offset.md,
                [`offset-lg-${offset.lg}`]: !!offset.lg,
                [`offset-xl-${offset.xl}`]: !!offset.xl,
                [`offset-xxl-${offset.xxl}`]: !!offset.xxl,
            })}
            {...props}
        >
            {children}
        </div>
    )
}

export interface RowProps {
    className?: string
}

export const Row: FCWC<RowProps> = ({ children, className }) => {
    return <div className={cx('row', className)}>{children}</div>
}
