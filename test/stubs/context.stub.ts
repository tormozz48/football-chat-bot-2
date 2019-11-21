export const createContextStub = ({lang, chatId}, callback) => {
    return {
        update: {
            message: {
                chat: {
                    id: chatId,
                },
                from: {
                    language_code: lang,
                },
            },
        },
        replyWithHTML: (...args) => callback(...args),
    };
};
