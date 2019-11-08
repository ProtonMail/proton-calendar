import React, { useCallback, useMemo } from 'react';
import {
    AppsSidebar,
    classnames,
    Href,
    FullLoader,
    LocalizedMiniCalendar,
    StorageSpaceStatus,
    useActiveBreakpoint,
    useToggle,
    TextLoader
} from 'react-components';
import { c } from 'ttag';
import { differenceInCalendarDays } from 'date-fns';
import PropTypes from 'prop-types';

import PrivateHeader from '../../components/layout/PrivateHeader';
import CalendarSidebar from './CalendarSidebar';
import Main from '../../components/Main';
import CalendarToolbar from './CalendarToolbar';
import DateCursorButtons from '../../components/DateCursorButtons';
import ViewSelector from '../../components/ViewSelector';
import TimezoneSelector from '../../components/TimezoneSelector';

import { VIEWS } from '../../constants';
import { fromUTCDate, toLocalDate } from 'proton-shared/lib/date/timezone';
import { getDateDiff } from './helper';

const { DAY, WEEK, MONTH, YEAR, AGENDA } = VIEWS;

/**
 * Converts a local date into the corresponding UTC date at 0 hours.
 * @param date
 * @returns {Date}
 */
const localToUtcDate = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

const CalendarContainerView = ({
    calendars = [],
    isLoading = false,
    isBlurred = false,

    displayWeekNumbers,
    weekStartsOn,

    tzid,
    setTzid,

    range,

    setCustom,

    view,

    utcDefaultDate,
    utcDate,
    utcDateRange,

    onCreateEvent,

    children,
    scrollRef
}) => {
    const { state: expanded, toggle: onToggleExpand } = useToggle();
    const { isNarrow } = useActiveBreakpoint();

    const localNowDate = useMemo(() => {
        return new Date(utcDefaultDate.getUTCFullYear(), utcDefaultDate.getUTCMonth(), utcDefaultDate.getUTCDate());
    }, [utcDefaultDate]);

    const localDate = useMemo(() => {
        return new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate());
    }, [utcDate]);

    const localDateRange = useMemo(() => {
        const [utcStart, utcEnd] = utcDateRange;
        return [toLocalDate(fromUTCDate(utcStart)), toLocalDate(fromUTCDate(utcEnd))];
    }, [utcDateRange]);

    const handleSelectDateRange = useCallback(([start, end]) => {
        const numberOfDays = differenceInCalendarDays(end, start);
        const newDate = localToUtcDate(start);
        if (numberOfDays >= 7) {
            setCustom({
                view: MONTH,
                range: Math.floor(numberOfDays / 7),
                date: newDate
            });
        } else {
            setCustom({
                view: WEEK,
                range: numberOfDays,
                date: newDate
            });
        }
    }, []);

    const handleClickLocalDate = useCallback((newDate) => {
        setCustom({ date: localToUtcDate(newDate) });
    }, []);

    const handleClickToday = useCallback(() => {
        setCustom({ date: utcDefaultDate });
    }, []);

    const handleChangeView = useCallback((newView) => {
        setCustom({ view: newView, range: undefined });
    }, []);

    const handleClickNext = useCallback(() => {
        setCustom({ date: getDateDiff(utcDate, range, view, 1) });
    }, [utcDate, range, view]);

    const handleClickPrev = useCallback(() => {
        setCustom({ date: getDateDiff(utcDate, range, view, -1) });
    }, [utcDate, range, view]);

    return (
        <div className="flex flex-nowrap no-scroll">
            <AppsSidebar
                items={[
                    <StorageSpaceStatus key="storage">
                        <Href url="/settings/subscription" target="_self" className="pm-button pm-button--primary">
                            {c('Action').t`Upgrade`}
                        </Href>
                    </StorageSpaceStatus>
                ]}
            />
            <div className={classnames(['content flex-item-fluid reset4print', isBlurred && 'filter-blur'])}>
                <PrivateHeader
                    url="/calendar"
                    inSettings={false}
                    title={c('Title').t`Calendar`}
                    expanded={expanded}
                    onToggleExpand={onToggleExpand}
                    onCreateEvent={onCreateEvent}
                    isNarrow={isNarrow}
                />
                <div className="flex flex-nowrap">
                    <CalendarSidebar
                        expanded={expanded}
                        onToggleExpand={onToggleExpand}
                        title={c('Title').t`Calendar`}
                        loading={isLoading}
                        onCreateEvent={onCreateEvent}
                        miniCalendar={
                            <LocalizedMiniCalendar
                                onSelectDateRange={handleSelectDateRange}
                                onSelectDate={handleClickLocalDate}
                                date={localDate}
                                now={localNowDate}
                                displayWeekNumbers={displayWeekNumbers}
                                dateRange={range >= 0 ? localDateRange : undefined}
                                weekStartsOn={weekStartsOn}
                                displayedOnDarkBackground={true}
                            />
                        }
                        calendars={calendars}
                    />
                    {isLoading ? (
                        <div className="calendar-loader-container aligncenter p1">
                            <FullLoader color="global-light" size={60} />
                            <TextLoader className="m0">{c('Info').t`Loading events`}</TextLoader>
                        </div>
                    ) : null}
                    <div className="main flex-item-fluid">
                        <Main>
                            <div className="flex flex-column">
                                <CalendarToolbar
                                    dateCursorButtons={
                                        <DateCursorButtons
                                            view={view}
                                            dateRange={localDateRange}
                                            currentDate={localDate}
                                            now={localNowDate}
                                            onToday={handleClickToday}
                                            onNext={handleClickNext}
                                            onPrev={handleClickPrev}
                                        />
                                    }
                                    viewSelector={
                                        <ViewSelector
                                            isNarrow={isNarrow}
                                            view={view}
                                            range={range}
                                            onChange={handleChangeView}
                                        />
                                    }
                                    timezoneSelector={
                                        <TimezoneSelector
                                            className="toolbar-select nomobile notablet"
                                            timezone={tzid}
                                            onChange={setTzid}
                                        />
                                    }
                                />
                                <div className="flex main-area--withToolbar">
                                    <div
                                        className="flex-item-fluid scroll-if-needed view-column-detail"
                                        ref={scrollRef}
                                    >
                                        {children}
                                    </div>
                                    <div className="w50p nomobile"></div>
                                </div>
                            </div>
                        </Main>
                    </div>
                </div>
            </div>
        </div>
    );
};

CalendarContainerView.propTypes = {
    calendars: PropTypes.array,
    isLoading: PropTypes.bool,
    isBlurred: PropTypes.bool,
    displayWeekNumbers: PropTypes.bool,
    weekStartsOn: PropTypes.number,
    tzid: PropTypes.string,
    setTzid: PropTypes.func,
    setCustom: PropTypes.func,
    onCreateEvent: PropTypes.func,
    utcDefaultDate: PropTypes.instanceOf(Date),
    utcDate: PropTypes.instanceOf(Date),
    utcDateRange: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    view: PropTypes.oneOf([DAY, WEEK, MONTH, YEAR, AGENDA]),
    children: PropTypes.node,
    range: PropTypes.number,
    scrollRef: PropTypes.object
};

export default CalendarContainerView;
