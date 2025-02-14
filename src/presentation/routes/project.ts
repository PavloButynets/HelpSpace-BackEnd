import express from "express";
import { AppContainer} from "../../container";
import {asyncWrapper} from "../middlewares/asyncWrapper";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {PROJECT_TYPES} from "../../container/types/ProjectTypes.";
import {ProjectController} from "../controllers/ProjectController";
import {CreateProjectDTO} from "../../application/dto/request/CreateProjectDTO";
import {AUTH_TYPES} from "../../container/types/AuthTypes";
import {AuthMiddleware} from "../middlewares/AuthMiddleware";



export const projectRoutes = () => {
    const container = AppContainer.getInstance().getContainer();

    const router = express.Router();
    const projectController = container.get<ProjectController>(PROJECT_TYPES.ProjectController);
    const authMiddleware = container.get<AuthMiddleware>(AUTH_TYPES.AuthMiddleware);

    router.use(authMiddleware.authMiddleware);
    router.post('/create',
        validationMiddleware(CreateProjectDTO),
        asyncWrapper(projectController.createProject.bind(projectController)));

    return router
}