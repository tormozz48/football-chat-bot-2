import { createConnection, ConnectionOptions, Connection } from 'typeorm';

export const dbConnection = {
    provide: 'dbConnection',
    useFactory: async (): Promise<Connection> => await createConnection(getConnectionOptions()),
};

function getConnectionOptions(): ConnectionOptions {
    const env = process.env.NODE_ENV || 'development';
    const dbPath = `./${env}.sqlite`;

    return {
        type: 'sqlite',
        database: dbPath,
        entities: [
            __dirname + '/models/*{.ts,.js}',
        ],
        synchronize: true,
        logging: false,
    };
}
