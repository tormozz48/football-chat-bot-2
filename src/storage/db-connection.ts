import {TypeOrmModule} from '@nestjs/typeorm';
import {DynamicModule} from '@nestjs/common';

const commonOptions = {
    entities: [__dirname + '/models/*{.ts,.js}'],
    synchronize: true,
    logging: false,
};

const connections = {
    development: {
        type: 'sqlite',
        database: 'development.sqlite',
        ...commonOptions,
    },
    test: {
        type: 'sqljs',
        ...commonOptions,
    },
    production: {
        type: 'sqlite',
        database: 'production.sqlite',
        ...commonOptions,
    },
};

export const getConnection = (): DynamicModule => {
    const env: string = process.env.NODE_ENV || 'development';
    return TypeOrmModule.forRoot(connections[env]);
};
