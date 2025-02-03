import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { config  } from './envConfig.js'; 
import { Router } from 'express';
import { createNotFoundError } from '../../utils/errorsHelper.js';
import { errorMiddleware } from '../../middlewares/error.js';

const CLIENT_URL = config.CLIENT_URL;
const router: Router = Router();

export const initialization = (app: Application): void => {
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

