import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "HelpSpace",
    entities: ["src/entity/*.js"],
    migrations: ['src/migration/*.ts'],
    logging: true,
    synchronize: true,
})