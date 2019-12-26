import {Module} from '@nestjs/common';
import {CommonModule} from '../common/common.module';
import {StorageModule} from '../storage/storage.module';

import {PlayerHelper} from './player.helper';
import {EventAddAction} from './event_add.action';
import {EventInfoAction} from './event_info.action';
import {EventRemoveAction} from './event_remove.action';
import {PlayerAddAction} from './player_add.action';
import {PlayerRemoveAction} from './player_remove.action';

@Module({
    imports: [CommonModule, StorageModule],
    providers: [
        EventAddAction,
        EventInfoAction,
        EventRemoveAction,
        PlayerAddAction,
        PlayerRemoveAction,
        PlayerHelper,
    ],
    exports: [],
})
export class ActionsModule {}
