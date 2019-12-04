import {EventEmitter} from 'events';

export class AppEmitter extends EventEmitter {
    public readonly EVENT_ADD: string = 'event_add';
    public readonly EVENT_INFO: string = 'event_info';
    public readonly EVENT_REMOVE: string = 'event_remove';
    public readonly PLAYER_ADD: string = 'player_add';
    public readonly PLAYER_REMOVE: string = 'player_remove';
}
