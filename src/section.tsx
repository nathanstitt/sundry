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
    padding: 5,
    borderBottom: '1px solid #ddd',
    margin: 0,
    color: '#666',
    backgroundColor: '#eee',
    textShadow: '1px 1px #fff',
    background: 'linear-gradient(to bottom,#eeeeee,#f6f6f6)',
})

const Body = styled.div(({ noPad, noBorder }: { noBorder?: boolean; noPad?: boolean }) => ({
    padding: noPad ? '0' : '1rem',
    [themeMedia.mobile]: {
        padding: '0.3rem',
    },
    borderWidth: noBorder ? 0 : 1,
}))

const SectionWrapper = styled.section({
    '& + &': {
        marginTop: '2rem',
    },
})

interface SectionProps {
    id: string
    className?: string
    heading: React.ReactNode
    controls?: React.ReactNode
    fullWidth?: boolean
    noPad?: boolean
    noBorder?: boolean
}

export const Section: FCWC<SectionProps> = ({
    className,
    id,
    heading,
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
            className={cx('section', 'card', 'p-0', className, { 'container-lg': !fullWidth })}
        >
            <Heading as="h3" className="sechead card-header d-flex">
                <Box flex align="center" onClick={onClick}>
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
                <Body className="secbody" noPad={noPad} noBorder={noBorder}>
                    {children}
                </Body>
            </div>
        </SectionWrapper>
    )
}
