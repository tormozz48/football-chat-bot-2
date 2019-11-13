import { createConnection } from 'typeorm';

export const dbConnection = {
    provide: 'dbConnection',
    useFactory: async () => await createConnection({
        type: 'sqlite',
        database: './db.sqlite',
        entities: [
            __dirname + '/models/*{.ts,.js}',
        ],
        synchronize: true,
        logging: false,
    }),
};
