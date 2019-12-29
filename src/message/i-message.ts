export interface IMessage {
    chatId: number;
    lang: string;
    text: string;
    fullText: string;
    command: string;
    name: string;
    getReplyStatus: () => string;
    getReplyData: () => any;
    setStatus: (status: string) => IMessage;
    withData: (data: any) => IMessage;
    answer: (args: any) => string | void;
}
