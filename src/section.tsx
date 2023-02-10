import { Icon } from './icon'
import { React, FCWC, useCallback, cx } from './common'
import { Box } from 'boxible'
import styled from '@emotion/styled'
import { themeColors, themeMedia } from './theme'
import { useRetainedCollapse } from './use-collapse'

const Heading = styled(Box)({
    cursor: 'pointer',
    position: 'sticky',
    top: `env(safe-area-inset-top, var(--navbarHeight))`,
    flex: 1,
    fontWeight: 700,
    fontSize: '0.9rem',
    //padding: 5,
    margin: 0,
    color: '#666',
    backgroundColor: '#eee',
    textShadow: '1px 1px #fff',
    background: 'linear-gradient(to bottom,#eeeeee,#f6f6f6)',
    borderBottom: '1px solid #ddd',
})

const Body = styled.div(({ noPad, noBorder }: { noBorder?: boolean; noPad?: boolean }) => ({
    padding: noPad ? '0' : '1rem',
    [themeMedia.mobile]: {
        padding: '0.3rem',
    },
    borderWidth: noBorder ? 0 : 1,
}))

const SectionWrapper = styled.section({
    marginBottom: '1rem',
    border: 'var(--bs-card-border-width) solid var(--bs-card-border-color)',
    borderRadius: 'var(--bs-card-border-radius)',
    '& + &': {
        marginTop: '2rem',
    },
})

const SectionFooter = styled.div(({ noPad }: { noPad: boolean | undefined }) => ({
    padding: noPad ? 0 : '0 1rem 1rem 1rem',
}))

export interface SectionProps {
    id: string
    bodyClassName?: string
    headingClassName?: string
    className?: string
    heading: React.ReactNode
    footer?: React.ReactNode
    controls?: React.ReactNode
    fullWidth?: boolean
    noPad?: boolean
    noBorder?: boolean
}

export const Section: FCWC<SectionProps> = ({
    id,
    className,
    bodyClassName,
    headingClassName,
    heading,
    footer,
    children,
    controls,
    fullWidth,
    noPad,
    noBorder,
}) => {
    const { getCollapseProps, setExpanded, isExpanded } = useRetainedCollapse(id, true)
    const onClick = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionWrapper
            id={`${id}-section`}
            data-test-id={`${id}-section`}
            className={cx('section', 'card', className)}
        >
            <Heading as="h3" className={cx('sechead', headingClassName)}>
                <Box flex align="center" padding="default" onClick={onClick}>
                    <Icon
                        className="me-1"
                        color={themeColors.gray2}
                        icon={isExpanded ? 'minusSquare' : 'plusSquare'}
                    />
                    {heading}
                </Box>
                {controls && <Box>{controls}</Box>}
            </Heading>
            <div {...getCollapseProps()}>
                <Body
                    noPad={noPad}
                    noBorder={noBorder}
                    className={cx('secbody', bodyClassName, {
                        'container-lg': !fullWidth,
                    })}
                >
                    {children}
                </Body>
                {footer && <SectionFooter noPad={noPad}>{footer}</SectionFooter>}
            </div>
        </SectionWrapper>
    )
}
