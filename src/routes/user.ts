import { Router } from 'express';

export const router: Router = Router();

router.get('/test', (req, res) => {
  console.log('Запит на /test отримано!');
  res.send('Привіт, це відповідь від сервера!');
});
