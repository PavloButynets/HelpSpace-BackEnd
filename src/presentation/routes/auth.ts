import express from "express";
import { AppContainer} from "../../container";
import {AUTH_TYPES} from "../../container/types/AuthTypes";
import {AuthController} from "../controllers/AuthController";
import {asyncWrapper} from "../middlewares/asyncWrapper";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {registerValidationEntity} from "../../validation/schemas/register";
import {loginValidationSchema} from "../../validation/schemas/login";



export const authRoutes = () => {
    const container = AppContainer.getInstance().getContainer();

    const router = express.Router();
    const authController = container.get<AuthController>(AUTH_TYPES.AuthController);
    router.post('/register',
        validationMiddleware(registerValidationEntity),
        asyncWrapper(authController.register.bind(authController)));
    router.post('/login',
        validationMiddleware(loginValidationSchema),
        asyncWrapper(authController.login.bind(authController)));

    return router
}