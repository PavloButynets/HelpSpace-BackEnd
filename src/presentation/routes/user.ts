import express from "express";
import { AppContainer} from "../../container";
import {UserController} from "../controllers/UserСontroller";
import {USER_TYPES} from "../../container/types/UserTypes";



export const userRoutes = () => {
    const container = AppContainer.getInstance().getContainer();
    const router = express.Router();
    const userController = container.get<UserController>(USER_TYPES.UserController);
    router.get('/getUsers', userController.getUsers);

    return router
}