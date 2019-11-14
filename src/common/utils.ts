import * as moment from 'moment';

// TODO remove this method in future
// allow to select event date manually
export const getEventDate = (): Date => {
    const currentDate = moment.utc();

    return currentDate
        .weekday(currentDate.weekday() > 0 ? 7 : 0)
        .hour(17)
        .minute(30)
        .second(0)
        .millisecond(0)
        .toDate();
};
