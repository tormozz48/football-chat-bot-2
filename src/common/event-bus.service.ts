import { EventEmitter } from 'events';

export class AppEmitter extends EventEmitter {
    public readonly EVENT_ADD: string = 'event_add';
    public readonly EVENT_INFO: string = 'event_info';
    public readonly EVENT_REMOVE: string = 'event_remove';
    public readonly PERSON_ADD: string = 'person_add';
    public readonly PERSON_REMOVE: string = 'person_remove';
}
