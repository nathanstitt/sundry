import { FCWC, cx } from './common'
import { Box, BoxProps } from 'boxible'
import styled from '@emotion/styled'

const FooterWrapper = styled(Box)((props) => ({
    ...props.theme.css.topLine,
}))

export const Footer: FCWC<{ className?: string } & BoxProps> = ({
    className,
    children,
    ...boxProps
}) => {
    return (
        <FooterWrapper className={cx('footer', className)} justify="end" gap {...boxProps}>
            {children}
        </FooterWrapper>
    )
}
