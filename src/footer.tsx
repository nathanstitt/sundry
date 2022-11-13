import { React, FCWC, cx } from './common'
import { Box, BoxProps } from 'boxible'
import styled from '@emotion/styled'
import { Theme } from './theme'

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
