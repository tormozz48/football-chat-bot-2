import { Module, Logger} from '@nestjs/common';
import { ConfigService } from './config.service';
import { AppEmitter } from './event-bus.service';
import { TemplateService } from './template.service';

@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
        },
        {
            provide: AppEmitter,
            useValue: new AppEmitter(),
        },
        {
            provide: Logger,
            useValue: new Logger(),
        },
        TemplateService,

    ],
    exports: [ConfigService, AppEmitter, Logger, TemplateService],
})
export class CommonModule {}
