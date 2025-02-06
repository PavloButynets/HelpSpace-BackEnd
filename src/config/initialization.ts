import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config  } from './envConfig';
import  { AppRoutes}  from "../presentation/routes/index";
import { createNotFoundError } from '../utils/errorsHelper';
import { errorMiddleware } from '../presentation/middlewares/error';
const CLIENT_URL = config.CLIENT_URL;

export const initialization = (app: Application): void => {

  app.use("/", AppRoutes.routes);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(cookieParser());
  app.use(
    cors({
      origin: CLIENT_URL,
      credentials: true,
      methods: 'GET, POST, PATCH, DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    })
  );

  app.use((_req, _res, next) => {
      console.log("error");
    next(createNotFoundError());
  });

  app.use(errorMiddleware);
};

