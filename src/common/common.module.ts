import {Module, Logger} from '@nestjs/common';
import {ConfigService} from './config.service';
import {AppEmitter} from './event-bus.service';
import {TemplateService} from './template.service';

@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(),
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
