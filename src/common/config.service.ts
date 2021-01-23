import * as envalid from 'envalid';
import { VK_MODES } from './constants';

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
            VK_CONFIRMATION: envalid.str(),
            VK_MODE: envalid.str({choices: [VK_MODES.LONG_POLLING, VK_MODES.CALLBACK]})
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
