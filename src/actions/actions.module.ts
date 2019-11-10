import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';

import { EventAddAction } from './event_add.action';
import { EventInfoAction } from './event_info.action';
import { EventRemoveAction } from './event_remove.action';
import { PersonAddAction } from './person_add.action';
import { PersonRemoveAction } from './person_remove.action';

@Module({
    imports: [CommonModule],
    providers: [
        EventAddAction,
        EventInfoAction,
        EventRemoveAction,
        PersonAddAction,
        PersonRemoveAction,
    ],
    exports: [],
})
export class ActionsModule {}
