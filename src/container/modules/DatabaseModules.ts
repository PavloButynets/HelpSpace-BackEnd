import { ContainerModule, interfaces } from "inversify";
import { DATABASE_TYPES } from "../types/DatabaseTypes";

import { myDataSource } from "../../config/database"; // Імпортуємо DataSource

const databaseModuleContainer = new ContainerModule((bind: interfaces.Bind) => {
    bind(DATABASE_TYPES.DataSource).toConstantValue(myDataSource);

});

export default databaseModuleContainer;
