import React from 'react';
import tinycolor from 'tinycolor2';
import { Icon, classnames } from 'react-components';

interface Props {
    color?: string;
    className?: string;
}
const CalendarIcon = ({ color, className }: Props) => {
    const colorModel = tinycolor(color);
    const iconColor = colorModel?.isValid() ? colorModel?.toHexString(false) : '';
    if (!iconColor) {
        return null;
    }
    return <Icon className={classnames(['flex-item-noshrink', className])} name="calendar" color={iconColor} />;
};

export default CalendarIcon;
