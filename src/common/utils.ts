import * as moment from 'moment';

export const parseEventDate = (str: string = '') => {
    str = str.trim();

    return moment(str).isValid() ? moment.utc(str).toDate() : null;
};

export const formatEventDate = (date: Date | string): string => {
    return moment.utc(date).format('DD-MM-YYYY HH:mm');
};
