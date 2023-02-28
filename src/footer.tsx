import { React, FCWC, styled, cx } from './common.js'
import { Box, BoxProps } from 'boxible'
import { Theme } from './theme.js'

const FooterWrapper = styled(Box)({
    ...Theme.css.topLine,
})

export const Footer: FCWC<{ className?: string } & BoxProps> = ({
    className,
    children,
    ...boxProps
}) => {
    return (
        <FooterWrapper
            padding="vertical"
            className={cx('footer', className)}
            justify="end"
            gap
            {...boxProps}
        >
            {children}
        </FooterWrapper>
    )
}
