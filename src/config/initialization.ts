import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config  } from './envConfig.js'; 
import { router } from "../presentation/routes/user.js";
import { createNotFoundError } from '../utils/errorsHelper.js';
import { errorMiddleware } from '../presentation/middlewares/error.js';
const CLIENT_URL = config.CLIENT_URL;

export const initialization = (app: Application): void => {
  app.use("/", router);

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

  app.use('/', router);

  app.use((_req, _res, next) => {
    next(createNotFoundError());
  });

  app.use(errorMiddleware);
};

