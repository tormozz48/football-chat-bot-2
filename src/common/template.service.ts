import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { readDirDeepSync } from 'read-dir-deep';
import { Injectable, Logger } from '@nestjs/common';

export interface IParams {
    action: string;
    status: string;
    lang?: string;
}

@Injectable()
export class TemplateService {
    private readonly DEFAULT_LANG: string = 'en';
    private readonly TEMPLATE_PATH: string = 'templates';

    private logger: Logger;
    private templatesMap: Map<string, (d: any) => string>;

    constructor(logger: Logger) {
        this.logger = logger;

        this.load();
    }

    public apply(params: IParams, data: any): string {
        this.logger.log(`apply template: ${params.action} ${params.status} ${params.lang}`);

        let template = this.getTemplate(params);

        if (!template) {
            params.lang = this.DEFAULT_LANG;
            template = this.getTemplate(params);
        }

        if (!template) {
            throw new Error('template-not-found');
        }

        return template(data);
    }

    private getTemplate(params: IParams): (data: any) => string {
        const {lang, action, status} = params;
        return this.templatesMap.get(this.getTemplateKey(lang, action, status));
    }

    private load() {
        this.logger.log('load templates');

        const templatesDir: string = path.join(process.cwd(), this.TEMPLATE_PATH);
        const templateFileNames: string[] = readDirDeepSync(templatesDir);

        this.templatesMap = templateFileNames.reduce((acc, fileName) => {
            this.logger.debug(`load template: ${fileName}`);
            const template = fs.readFileSync(fileName, {encoding: 'utf-8'});

            const [, lang, action, status] = fileName.replace(/\.hbs$/, '').split('/');
            return acc.set(
                this.getTemplateKey(lang, action, status),
                handlebars.compile(template),
            );
        }, new Map());
    }

    private getTemplateKey(lang: string, action: string, status: string): string {
        return `${lang}-${action}-${status}`;
    }
}
