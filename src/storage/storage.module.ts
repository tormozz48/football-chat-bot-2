import {Module} from '@nestjs/common';

import {CommonModule} from '../common/common.module';
import {getConnection} from './db-connection';
import {StorageService} from './storage.service';

@Module({
    imports: [CommonModule, getConnection()],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule {}
