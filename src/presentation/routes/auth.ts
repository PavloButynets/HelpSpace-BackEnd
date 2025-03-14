import express from "express";
import { AppContainer} from "../../container";
import {AUTH_TYPES} from "../../container/types/AuthTypes";
import {AuthController} from "../controllers/AuthController";
import {asyncWrapper} from "../middlewares/asyncWrapper";
import {validationMiddleware} from "../middlewares/validationMiddleware";
import {LoginRequestDTO} from "../../application/dto/request/LoginRequest";
import {RegisterUserDTO} from "../../application/dto/request/RegisterUserDTO";



export const authRoutes = () => {
    const container = AppContainer.getInstance().getContainer();

    const router = express.Router();
    const authController = container.get<AuthController>(AUTH_TYPES.AuthController);
    router.post('/signup',
        validationMiddleware(RegisterUserDTO),
        asyncWrapper(authController.register.bind(authController)));
    router.post('/login',
        validationMiddleware(LoginRequestDTO),
        asyncWrapper(authController.login.bind(authController)));

    router.get('/confirm-email/:token', asyncWrapper(authController.confirmEmail.bind(authController)));

    router.get('/refresh', asyncWrapper(authController.refreshAccessToken.bind(authController)));
    router.post('/logout', asyncWrapper(authController.logout.bind(authController)));
    return router
}