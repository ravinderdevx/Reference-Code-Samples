import React from 'react';
import Moment from 'react-moment';

const FormatDateTime = ({ date, format }) => {
    if (!date)
        return '';

    const dateToFormat = new Date(date);
    return (
        <Moment date={dateToFormat} format={format} />
    )
}

export default FormatDateTime;