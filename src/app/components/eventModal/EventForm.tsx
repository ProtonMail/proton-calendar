import React from 'react';
import { c } from 'ttag';
import { Row, Label, Info } from 'react-components';

import Notifications from './Notifications';
import AllDayCheckbox from './inputs/AllDayCheckbox';
import CalendarSelectRow from './rows/CalendarSelectRow';
import LocationRow from './rows/LocationRow';
import DescriptionRow from './rows/DescriptionRow';
import FrequencyRow from './rows/FrequencyRow';
import TimezoneRow from './rows/TimezoneRow';
import DateTimeRow from './rows/DateTimeRow';
import TitleRow from './rows/TitleRow';
import { getAllDayCheck } from './eventForm/stateActions';
import { EventModel, EventModelErrors } from '../../interfaces/EventModel';

interface Props {
    isSubmitted: boolean;
    isNarrow: boolean;
    displayWeekNumbers: boolean;
    weekStartsOn: number;
    errors: EventModelErrors;
    model: EventModel;
    setModel: (value: EventModel) => void;
}

const EventForm = ({ isSubmitted, isNarrow, displayWeekNumbers, weekStartsOn, errors, model, setModel }: Props) => {
    const allDayRow = (
        <Row collapseOnMobile={true}>
            <span className="pm-label" />
            <div className="flex-item-fluid">
                <AllDayCheckbox
                    className="mb1"
                    checked={model.isAllDay}
                    onChange={(isAllDay) => setModel({ ...model, ...getAllDayCheck(model, isAllDay) })}
                />
            </div>
        </Row>
    );

    const frequencyRow = model.hasFrequencyRow ? (
        <FrequencyRow
            label={c('Label').t`Frequency`}
            frequencyModel={model.frequencyModel}
            start={model.start}
            displayWeekNumbers={displayWeekNumbers}
            weekStartsOn={weekStartsOn}
            errors={errors}
            isSubmitted={isSubmitted}
            onChange={(frequencyModel) => setModel({ ...model, frequencyModel })}
        />
    ) : null;

    const timezoneRows = !model.isAllDay ? (
        <TimezoneRow
            startLabel={c('Label').t`Start timezone`}
            endLabel={c('Label').t`End timezone`}
            model={model}
            setModel={setModel}
        />
    ) : null;

    const calendarDisabledWhy = !model.hasCalendarRow ? (
        <Info title={c('Label').t`Calendar cannot be changed for recurring events`} />
    ) : null;
    const calendarRow = model.calendars.length ? (
        <CalendarSelectRow
            label={
                <>
                    {c('Label').t`Calendar`} {calendarDisabledWhy}
                </>
            }
            model={model}
            setModel={setModel}
            disabled={!model.hasCalendarRow}
        />
    ) : null;

    return (
        <>
            <TitleRow
                label={c('Label').t`Title`}
                type={model.type}
                value={model.title}
                error={errors.title}
                onChange={(value) => setModel({ ...model, title: value })}
                isSubmitted={isSubmitted}
            />
            {allDayRow}
            <DateTimeRow
                label={c('Label').t`Time`}
                model={model}
                setModel={setModel}
                endError={errors.end}
                displayWeekNumbers={displayWeekNumbers}
                weekStartsOn={weekStartsOn}
                isNarrow={isNarrow}
            />
            {timezoneRows}
            {frequencyRow}
            {calendarRow}
            <LocationRow
                label={c('Label').t`Location`}
                value={model.location}
                onChange={(location) => setModel({ ...model, location })}
            />
            <DescriptionRow
                label={c('Label').t`Description`}
                value={model.description}
                onChange={(description) => setModel({ ...model, description })}
            />
            <Row>
                <Label>{c('Label').t`Notifications`}</Label>
                <div className="flex-item-fluid">
                    {model.isAllDay ? (
                        <Notifications
                            notifications={model.fullDayNotifications}
                            defaultNotification={model.defaultFullDayNotification}
                            onChange={(notifications) => {
                                setModel({
                                    ...model,
                                    fullDayNotifications: notifications,
                                    hasModifiedNotifications: {
                                        ...model.hasModifiedNotifications,
                                        fullDay: true
                                    }
                                });
                            }}
                        />
                    ) : (
                        <Notifications
                            notifications={model.partDayNotifications}
                            defaultNotification={model.defaultPartDayNotification}
                            onChange={(notifications) => {
                                setModel({
                                    ...model,
                                    partDayNotifications: notifications,
                                    hasModifiedNotifications: {
                                        ...model.hasModifiedNotifications,
                                        partDay: true
                                    }
                                });
                            }}
                        />
                    )}
                </div>
            </Row>
        </>
    );
};

export default EventForm;