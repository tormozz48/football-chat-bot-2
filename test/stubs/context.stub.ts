import {TelegramMessage} from '../../src/telegram/telegram.message';
import moment = require('moment');

export const createContextStub = (params: any, callback) => {
    const {
        lang = 'en',
        chatId = 1,
        firstName,
        lastName,
        text = '',
        command = '',
    } = params;

    return new TelegramMessage({
        command,
        update: {
            message: {
                chat: {
                    id: chatId,
                },
                from: {
                    language_code: lang,
                    first_name: firstName,
                    last_name: lastName,
                },
                text,
            },
        },
        replyWithHTML: (...args) => callback(...args),
    });
};

export const createEventAddContextStub = (params: any, callback) => {
    const defaultDate = moment.utc().add(2, 'days').format('YYYY-MM-DD HH:mm');

    params.command = 'event_add';
    params.text = params.text || `/event_add ${defaultDate}`;

    return createContextStub(params, callback);
};
