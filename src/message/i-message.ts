export interface IMessage {
    chatId: number;
    lang: string;
    text: string;
    name: string;
    getReplyStatus: () => string;
    getReplyData: () => any;
    setStatus: (status: string) => IMessage;
    withData: (data: any) => IMessage;
    answer: (args: any) => string|void;
}
