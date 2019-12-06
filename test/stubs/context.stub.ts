import {TelegramMessage} from '../../src/telegram/telegram.message';

export const createContextStub = (params: any, callback) => {
    const {lang = 'en', chatId = 1, firstName, lastName, text = ''} = params;

    return new TelegramMessage({
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
    params.text = params.text || '/event_add 2019-06-12 17:30';

    return createContextStub(params, callback);
};
