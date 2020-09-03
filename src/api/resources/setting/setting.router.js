import express from 'express';
import passport from 'passport';
import settingController from './setting.controller';

export const settingRouter = express.Router();
settingRouter
  .route('/')
  //.get(passport.authenticate('jwt', { session: false }), settingController.findOne)
  .get(settingController.findOne)
settingRouter
  .route('/:id')
  .put(passport.authenticate('jwt', { session: false }), settingController.update);
