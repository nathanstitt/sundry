import { Icon } from './icon.js'
import { CSSProperties } from 'react'
import { React, FCWC, styled, useCallback, cx } from './common.js'
import { Box } from 'boxible'
import { themeColors, themeMedia } from './theme.js'
import { useRetainedCollapse, useCollapse, useControlledCollapse } from './use-collapse.js'

const panelColors = themeColors.panel

const Heading = styled(Box)({
    cursor: 'pointer',
    position: 'sticky',
    flex: 1,
    fontWeight: 700,
    fontSize: '0.9rem',
    margin: 0,
    color: '#666',

    backgroundColor: panelColors.headingBackground,
    top: 'var(--section-sticky-top)',
    textShadow: '1px 1px #fff',
    background: `linear-gradient(to bottom,${panelColors.headingBackground},${panelColors.headingBackgroundGradientTo})`,
    borderBottom: '1px solid #ddd',
})

type BodyProps = {
    padding?: CSSProperties['padding'],
    scrollable?: boolean,
    maxHeight?: CSSProperties['maxHeight'],
    minHeight?: CSSProperties['minHeight'],
    noBorder?: boolean;
    noPad?: boolean
}
const Body = styled.div(({
    noPad, noBorder, maxHeight, minHeight, padding = '1rem',
}: BodyProps) => ({
    margin: 0,
    padding: noPad ? 0 : padding,
    [themeMedia.mobile]: {
        padding: noPad ? '0' : '0.3rem',
    },
    minHeight,
    maxHeight,

    borderStyle: 'solid',
    borderWidth: noBorder ? 0 : 1,
    borderColor: panelColors.border,
    backgroundColor: panelColors.bodyBackground,

    alignContent: 'flex-start',
    overflow: maxHeight ? 'auto' : 'visible',
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
    backgroundColor: panelColors.bodyBackground,
}))

export interface SectionProps {
    id: string
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
    bodyClassName?: string
    hideCollapsedControls?: boolean
    bodyPadding?: CSSProperties['padding'],
    maxHeight?: CSSProperties['maxHeight'],
    minHeight?: CSSProperties['minHeight'],
}

type URSectionProps = SectionProps & {
    collapseProps: any
    dispayAsExpanded: boolean
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
    noPad = isRow,
    dispayAsExpanded,
    hideCollapsedControls = false,
    bodyPadding,
    minHeight = 100,
    maxHeight,
    noBorder,
}) => {
    const onClick = useCallback(() => {
        onToggle?.(!isExpanded)
    }, [onToggle, isExpanded])
    return (
        <SectionWrapper
            id={`${id}-section`}
            data-testid={`${id}-section`}
            className={cx('section', 'card', className)}
        >
            <Heading as="h3" className={cx('sechead', headingClassName)}>
                <Box flex align="center" padding="default" onClick={onClick}>
                    <Icon
                        className="me-1"
                        color={panelColors.icon}
                        icon={dispayAsExpanded ? 'minusSquare' : 'plusSquare'}
                    />
                    {heading}
                </Box>
                {controls && (!hideCollapsedControls || dispayAsExpanded) ? <Box>{controls}</Box> : null}
            </Heading>
            <div {...collapseProps}>
                <Body
                    noPad={noPad}
                    padding={bodyPadding}
                    noBorder={noBorder}
                    maxHeight={maxHeight}
                    minHeight={isExpanded ? minHeight : 0}
                    className={cx('secbody', bodyClassName, {
                        'container-lg': !fullWidth,
                        row: isRow,
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

const RetainedSection: FCWC<SectionProps> = ({ id, defaultCollapsed, ...props }) => {
    const { getCollapseProps, setExpanded, isExpanded, dispayAsExpanded } = useRetainedCollapse(id, !defaultCollapsed)

    const onToggle = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            dispayAsExpanded={dispayAsExpanded}
            {...props}
            collapseProps={getCollapseProps()}
        />
    )
}

const UnRetainedSection: FCWC<SectionProps> = ({ id, defaultCollapsed, ...props }) => {

    const { getCollapseProps, setExpanded, isExpanded, dispayAsExpanded } = useCollapse(!defaultCollapsed)
    const onToggle = useCallback(() => setExpanded(!isExpanded), [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            {...props}
            dispayAsExpanded={dispayAsExpanded}
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
    const { getCollapseProps, setExpanded, dispayAsExpanded } = useControlledCollapse(isExpanded, (isExpanded) => {
        onToggleProp(isExpanded)
    })

    const onToggle = useCallback(() => {
        setExpanded(!isExpanded)
    }, [isExpanded, setExpanded])

    return (
        <SectionDOM
            id={id}
            onToggle={onToggle}
            isExpanded={isExpanded}
            dispayAsExpanded={dispayAsExpanded}
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
    if (isExpanded != null && onToggle) {
        return <ControlledSection {...props} onToggle={onToggle} isExpanded={isExpanded} />
    }
    if (retainState) return <RetainedSection {...props} />
    return <UnRetainedSection {...props} />
}
