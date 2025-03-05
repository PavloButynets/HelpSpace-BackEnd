import { Container } from 'inversify';
import userModuleContainer from "./modules/UserModule";
import databaseModuleContainer from "./modules/DatabaseModules";
import authModuleContainer from "./modules/AuthModule";
import tokenModuleContainer from "./modules/TokenModule";
import projectModuleContainer from "./modules/ProjectModule";
import emailModuleContainer from "./modules/EmailModule";

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
        this.container.load(projectModuleContainer)
        this.container.load(emailModuleContainer)
    }

    public getContainer(): Container {
        return this.container;
    }

}