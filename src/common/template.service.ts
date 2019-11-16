import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { Injectable, Logger } from '@nestjs/common';

interface ITemplate {
    action: string;
    status: string;
    lang: string;
    templateFn: (data: any) => string;
}

interface IParams {
    action: string;
    status: string;
    lang?: string;
}

@Injectable()
export class TemplateService {
    private readonly DEFAULT_LANG: string = 'en';
    private readonly TEMPLATE_PATH: string = 'templates';

    private logger: Logger;
    private templates: ITemplate[];

    constructor(logger: Logger) {
        this.logger = logger;

        this.load();
    }

    public apply(params: IParams, data: any) {
        this.logger.log(`apply template: ${params.action} ${params.status} ${params.lang}`);

        let template: ITemplate;

        template = this.getTemplate(params);

        if (!template) {
            params.lang = this.DEFAULT_LANG;
            template = this.getTemplate(params);
        }

        if (!template) {
            throw new Error('template-not-found');
        }

        return template.templateFn(data);
    }

    private getTemplate(params: IParams) {
        return this.templates.find((item: ITemplate) => {
            return item.action === params.action
                && item.status === params.status
                && item.lang === params.lang;
        });
    }

    private load() {
        this.logger.log('load templates');

        const templatesDir: string = path.join(process.cwd(), this.TEMPLATE_PATH);
        const templates: string[] = fs.readdirSync(templatesDir);

        this.templates = templates.map((item: string) => {
            const [action, status, lang] = item.split('.');
            const templatePath: string = path.join(templatesDir, item);
            const template: string = fs.readFileSync(templatePath, {encoding: 'utf-8'});

            this.logger.log(`template loaded: ${action} ${status} ${lang}`);

            return {
                action,
                status,
                lang,
                templateFn: handlebars.compile(template),
            };
        });
    }
}
