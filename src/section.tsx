import { Icon } from './icon.js'
import { React, FCWC, styled, useCallback, cx } from './common.js'
import { Box } from 'boxible'
import { themeColors, themeMedia } from './theme.js'
import { useRetainedCollapse, useCollapse, useControlledCollapse } from './use-collapse.js'

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
    isRow?: boolean
    noPad?: boolean
    noBorder?: boolean
    retainState?: boolean
    onToggle?: (isExpanded: boolean) => void
    defaultCollapsed?: boolean
    isExpanded?: boolean
}

type URSectionProps = SectionProps & {
    collapseProps: any
}

const SectionDOM: FCWC<URSectionProps> = ({
    id,
    className,
    isExpanded,
    collapseProps,
    onToggle,
    bodyClassName,
    headingClassName,
    heading,
    footer,
    children,
    isRow,
    controls,
    fullWidth,
    noPad,
    noBorder,
}) => {
    const onClick = useCallback(() => {
        onToggle?.(!isExpanded)
    }, [onToggle])
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
            <div {...collapseProps}>
                <Body
                    noPad={noPad}
                    noBorder={noBorder}
                    className={cx('secbody', bodyClassName, {
                        'container-lg': !fullWidth,
                        row: isRow != false,
                    })}
                >
                    {children}
                </Body>
                {footer && (
                    <SectionFooter className="footer" noPad={noPad}>
                        {footer}
                    </SectionFooter>
                )}
            </div>
        </SectionWrapper>
    )
}

const RetainedSection: FCWC<SectionProps> = ({ id, ...props }) => {
    const { getCollapseProps, setExpanded, isExpanded } = useRetainedCollapse(id, true)
    const onToggle = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            {...props}
            collapseProps={getCollapseProps()}
        />
    )
}

const UnRetainedSection: FCWC<SectionProps> = ({ id, defaultCollapsed, ...props }) => {
    const { getCollapseProps, setExpanded, isExpanded } = useCollapse(defaultCollapsed)
    const onToggle = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            {...props}
            collapseProps={getCollapseProps()}
        />
    )
}

type ControlledSectionProps = Omit<SectionProps, 'isExpanded' | 'onToggle'> & {
    isExpanded: boolean
    onToggle: (isToggled: boolean) => void
}
const ControlledSection: FCWC<ControlledSectionProps> = ({
    id,
    isExpanded,
    onToggle: onToggleProp,
    ...props
}) => {
    const { getCollapseProps, setExpanded } = useControlledCollapse(isExpanded, (isExpanded) => {
        onToggleProp(isExpanded)
    })
    const onToggle = useCallback(() => {
        setExpanded(!isExpanded)
    }, [isExpanded, setExpanded])

    //const onToggle = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            {...props}
            collapseProps={getCollapseProps()}
        />
    )
}

export const Section: FCWC<SectionProps> = ({
    retainState = true,
    isExpanded,
    onToggle,
    ...props
}) => {
    console.log(retainState, isExpanded, onToggle)
    if (isExpanded != null && onToggle) {
        return <ControlledSection {...props} onToggle={onToggle} isExpanded={isExpanded} />
    }
    if (retainState) return <RetainedSection {...props} />
    return <UnRetainedSection {...props} />
}
