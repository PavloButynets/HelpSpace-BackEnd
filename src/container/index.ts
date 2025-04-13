import { Container } from 'inversify';
import userModuleContainer from "./modules/UserModule";
import databaseModuleContainer from "./modules/DatabaseModules";
import authModuleContainer from "./modules/AuthModule";
import tokenModuleContainer from "./modules/TokenModule";
import eventModuleContainer from "./modules/EventModule";
import emailModuleContainer from "./modules/EmailModule";
import locationModuleContainer from "./modules/LocationModule";
import categoryModuleContainer from "./modules/CategoryModule";

export class AppContainer {
    private static _instance: AppContainer | null = null; // Singleton instance
    private container: Container;

    private constructor() {
        this.container = new Container();
    }

    public static getInstance(): AppContainer {
        if (!AppContainer._instance) {
            AppContainer._instance = new AppContainer();
        }
        return AppContainer._instance;
    }

    public loadModules(): void {
        this.container.load(databaseModuleContainer)
        this.container.load(authModuleContainer)
        this.container.load(userModuleContainer);
        this.container.load(tokenModuleContainer);
        this.container.load(eventModuleContainer)
        this.container.load(emailModuleContainer)
        this.container.load(locationModuleContainer)
        this.container.load(categoryModuleContainer)
    }

    public getContainer(): Container {
        return this.container;
    }

}