import express, {Application} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import {config} from './envConfig';
import {AppRoutes} from "../presentation/routes/index";
import {createNotFoundError} from '../utils/errorsHelper';
import {errorMiddleware} from '../presentation/middlewares/error';

type CookieOptions = {
    maxAge: number,
    httpOnly: boolean,
    secure: boolean,
    sameSite: 'none' | 'lax' | 'strict' | 'none',
    domain: string
}
export const COOKIE_OPTIONS: CookieOptions = {
    maxAge: 24 * 60 * 60 * 10000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: config.COOKIE_DOMAIN
}

export const initialization = (app: Application): void => {

    app.use(cookieParser());

    app.use(express.json({limit: '10mb'}));
    app.use(express.urlencoded({ extended: true }));

    app.use(express.urlencoded({extended: true}));
    app.use("/", AppRoutes.routes);

    app.use(
        cors({
            origin: config.CLIENT_URL,
            credentials: true,
            methods: 'GET, POST, PATCH, DELETE',
            allowedHeaders: 'Content-Type, Authorization',
        })
    );

    app.use((_req, _res, next) => {
        next(createNotFoundError());
    });
    app.use(errorMiddleware);

};

