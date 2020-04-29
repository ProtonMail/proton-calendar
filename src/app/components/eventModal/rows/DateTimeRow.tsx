import React from 'react';
import { c } from 'ttag';
import { DateInput, Label, Row, TimeInput, classnames } from 'react-components';
import {
    convertUTCDateTimeToZone,
    convertZonedDateTimeToUTC,
    fromUTCDate,
    toUTCDate
} from 'proton-shared/lib/date/timezone';
import { MILLISECONDS_IN_MINUTE, startOfDay } from 'proton-shared/lib/date-fns-utc';

import { addDays, isValid } from 'date-fns';
import getFrequencyModelChange from '../eventForm/getFrequencyModelChange';
import { getDateTimeState, getTimeInUtc } from '../eventForm/time';
import { MAXIMUM_DATE, MINIMUM_DATE } from '../../../constants';
import { DateTimeModel, EventModel } from '../../../interfaces/EventModel';

const DEFAULT_MIN_TIME = new Date(Date.UTC(2000, 0, 1, 0, 0));

interface Props {
    collapseOnMobile?: boolean;
    label: React.ReactNode;
    model: EventModel;
    setModel: (value: EventModel) => void;
    displayWeekNumbers: boolean;
    weekStartsOn: number;
    endError: any;
    isNarrow?: boolean;
}

const DateTimeRow = ({
    collapseOnMobile,
    label,
    model,
    setModel,
    displayWeekNumbers,
    weekStartsOn,
    endError,
    isNarrow
}: Props) => {
    const { isAllDay, start, end } = model;

    const startUtcDate = getTimeInUtc(start, false);
    const endUtcDate = getTimeInUtc(end, false);

    const isDuration = +endUtcDate - +startUtcDate < 24 * 60 * MILLISECONDS_IN_MINUTE;
    const minEndTimeInTimezone = toUTCDate(convertUTCDateTimeToZone(fromUTCDate(startUtcDate), end.tzid));
    const { time: minEndTime } = getDateTimeState(isDuration ? minEndTimeInTimezone : DEFAULT_MIN_TIME, '');

    const getMinEndDate = () => {
        const { date: minDate } = getDateTimeState(minEndTimeInTimezone, '');
        // If the minDate with the currently selected end time would lead to an error, don't allow it to be selected
        const minTimeUtcDate = getTimeInUtc({ ...end, date: minDate, time: end.time }, false);
        return startUtcDate > minTimeUtcDate ? addDays(minDate, 1) : minDate;
    };

    const minEndDate = isAllDay ? start.date : getMinEndDate();

    const getStartChange = (newStart: DateTimeModel) => {
        const newStartUtcDate = getTimeInUtc(newStart, false);
        const diffInMs = +newStartUtcDate - +startUtcDate;

        const newEndDate = new Date(+endUtcDate + diffInMs);
        const endLocalDate = toUTCDate(convertUTCDateTimeToZone(fromUTCDate(newEndDate), end.tzid));
        const newEnd = getDateTimeState(endLocalDate, end.tzid);

        return {
            start: newStart,
            end: newEnd
        };
    };

    const getEndTimeChange = (newTime: Date) => {
        const diffMs = +newTime - +minEndTime;

        const endTimeInTimezone = toUTCDate(convertUTCDateTimeToZone(fromUTCDate(endUtcDate), end.tzid));

        const minEndUtcDateBase = isDuration ? minEndTimeInTimezone : startOfDay(endTimeInTimezone);

        const endUtcDateBase = toUTCDate(convertZonedDateTimeToUTC(fromUTCDate(minEndUtcDateBase), end.tzid));
        const newEndUtcDate = new Date(+endUtcDateBase + diffMs);
        const endLocalDate = toUTCDate(convertUTCDateTimeToZone(fromUTCDate(newEndUtcDate), end.tzid));

        return getDateTimeState(endLocalDate, end.tzid);
    };

    const handleChangeStartDate = (newDate: Date | undefined) => {
        if (!newDate || !isValid(newDate)) {
            return;
        }
        const newStart = { ...start, date: newDate };
        setModel({
            ...model,
            frequencyModel: getFrequencyModelChange(start, newStart, model.frequencyModel),
            ...getStartChange(newStart)
        });
    };

    const handleChangeStartTime = (newTime: Date) => {
        setModel({
            ...model,
            ...getStartChange({
                ...start,
                time: newTime
            })
        });
    };

    const handleEndUpdate = (newEnd: DateTimeModel) => {
        const endTime = getTimeInUtc(newEnd, false);
        if (startUtcDate > endTime) {
            return;
        }
        setModel({
            ...model,
            end: newEnd
        });
    };

    const handleChangeEndDate = (newDate: Date | undefined) => {
        if (!newDate || !isValid(newDate)) {
            return;
        }
        handleEndUpdate({
            ...end,
            date: newDate
        });
    };

    const handleChangeEndTime = (newTime: Date) => {
        handleEndUpdate(getEndTimeChange(newTime));
    };

    const startTimeInput = isAllDay ? null : (
        <TimeInput id="startTime" className="ml0-5" value={start.time} onChange={handleChangeStartTime} />
    );

    const endTimeInput = isAllDay ? null : (
        <TimeInput
            id="endTime"
            className="ml0-5"
            value={end.time}
            onChange={handleChangeEndTime}
            aria-invalid={!!endError}
            displayDuration={isDuration}
            min={minEndTime}
        />
    );

    const startDateInput = (
        <DateInput
            id="startDate"
            className={classnames([!isAllDay && 'mr0-5'])}
            required
            value={start.date}
            onChange={handleChangeStartDate}
            displayWeekNumbers={displayWeekNumbers}
            weekStartsOn={weekStartsOn}
            min={MINIMUM_DATE}
            max={MAXIMUM_DATE}
        />
    );

    const endDateInput = (
        <DateInput
            id="endDate"
            className={classnames([!isAllDay && 'mr0-5'])}
            required
            value={end.date}
            onChange={handleChangeEndDate}
            aria-invalid={!!endError}
            displayWeekNumbers={displayWeekNumbers}
            weekStartsOn={weekStartsOn}
            min={minEndDate}
            max={MAXIMUM_DATE}
        />
    );

    if (isNarrow) {
        return (
            <>
                <Row collapseOnMobile={collapseOnMobile}>
                    <Label htmlFor="startDate">{c('Label').t`From`}</Label>
                    <div className="flex-item-fluid">
                        <div className="flex flex-nowrap">
                            {startDateInput}
                            {startTimeInput}
                        </div>
                    </div>
                </Row>
                <Row collapseOnMobile={collapseOnMobile}>
                    <Label htmlFor="endDate">{c('Label').t`To`}</Label>
                    <div className="flex-item-fluid">
                        <div className="flex flex-nowrap mb0-5">
                            {endDateInput}
                            {endTimeInput}
                        </div>
                    </div>
                </Row>
            </>
        );
    }

    return (
        <Row collapseOnMobile={collapseOnMobile}>
            <Label>{label}</Label>
            <div className="flex-item-fluid">
                <div className="flex flex-wrap flex-items-center">
                    <div className="flex flex-nowrap w100 mb0-5">
                        {startDateInput}
                        {startTimeInput}
                    </div>
                    <div className="flex flex-nowrap w100">
                        {endDateInput}
                        {endTimeInput}
                    </div>
                </div>
            </div>
        </Row>
    );
};

export default DateTimeRow;