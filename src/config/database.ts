import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "HelpSpace",
    entities: ["src/domain/entities/*.ts"],
    migrations: ['migrations/*.ts'],
    logging: false,
    synchronize: true,
})