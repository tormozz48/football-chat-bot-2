import * as envalid from 'envalid';

export class ConfigService {
    private readonly envConfig: Record<string, string>;

    constructor() {
        this.envConfig = envalid.cleanEnv(process.env, {
            PORT: envalid.port({default: 3000}),
            TELEGRAM_BOT_TOKEN: envalid.str(),
            TELEGRAM_USE_PROXY: envalid.bool({default: false}),
            TELEGRAM_PROXY_HOST: envalid.host(),
            TELEGRAM_PROXY_PORT: envalid.port(),
            TELEGRAM_PROXY_LOGIN: envalid.str(),
            TELEGRAM_PROXY_PASSWORD: envalid.str(),
            VK_TOKEN: envalid.str(),
        });
    }

    /**
     *
     * Returns value from config by it key
     * @param {string} key
     * @returns {string}
     *
     * @memberOf ConfigService
     */
    public get(key: string): string {
        return this.envConfig[key];
    }
}
