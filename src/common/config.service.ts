import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
    private readonly CONFIG_FILE_NAME: string = '.env';
    private readonly envConfig: Record<string, string>;

    constructor() {
        if (fs.existsSync(this.CONFIG_FILE_NAME)) {
            this.envConfig = dotenv.parse(fs.readFileSync(this.CONFIG_FILE_NAME));
        }
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
