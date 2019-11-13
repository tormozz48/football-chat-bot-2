import { Module } from '@nestjs/common';

import { CommonModule } from '../common/common.module';
import { dbConnection } from './db-connection';
import { StorageService } from './storage.service';

@Module({
    imports: [CommonModule],
    providers: [dbConnection, StorageService],
    exports: [StorageService],
})
export class StorageModule {
}
