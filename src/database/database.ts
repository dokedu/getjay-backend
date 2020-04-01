import {ConnectionOptions, getConnectionManager} from 'typeorm';
import {Connection} from "typeorm/connection/Connection";
import {environmentVariables} from '../config/environment.config';

export let databaseOK = false;
export let connection: Connection;
export const initializeDatabase = async () => {
    console.log(environmentVariables.postgresHost);

    let entityPath;
    if (process.env.NODE_ENV === 'production')
        entityPath = "database/entity/**/*.js";
    else
        entityPath = (__filename.split('.')[1] === 'ts') ? "src/database/entity/**/*.ts" : "dist/database/entity/**/*.js";

    const options: ConnectionOptions = {
        type: "postgres",
        host: environmentVariables.postgresHost,
        port: Number(environmentVariables.postgresPort),
        username: environmentVariables.postgresUser,
        password: environmentVariables.postgresPassword,
        database: environmentVariables.postgresDb,
        entities: [entityPath],
        synchronize: true,
    };

    try {
        const connectionManager = getConnectionManager();
        connection = connectionManager.create(options);
        await connection.connect();
        console.log('✔️ Connection to Database established.');
        databaseOK = true;

    } catch (error) {
        console.log('❌ Error: Could not connect to Database');
        console.log(error);
        databaseOK = false;
    }
};
