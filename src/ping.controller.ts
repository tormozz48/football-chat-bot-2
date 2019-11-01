import { Controller, Get } from '@nestjs/common';

@Controller()
export class PingController {

    @Get('/ping')
    getHello(): string {
        return 'ok';
    }
}
