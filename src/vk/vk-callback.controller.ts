import { Controller, Logger, Next, Post, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from 'src/common/config.service';
import { VK_MODES } from 'src/common/constants';
import { VKService } from './vk.service';

@Controller()
export class VKCallbackController {
    constructor(
        private readonly logger: Logger,
        private readonly config: ConfigService,
        private readonly vkService: VKService
    ) {}

    @Post('/vk/callback')
    public async handleCallback(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction) {
        if (this.config.get('VK_MODE') === VK_MODES.CALLBACK) {
            this.vkService.getBot().webhookCallback(request, response, next);
        } else {
            this.logger.warn('Callback API disabled. Only long-polling allowed')
            return 'Callback API disabled';
        }
    }
}
