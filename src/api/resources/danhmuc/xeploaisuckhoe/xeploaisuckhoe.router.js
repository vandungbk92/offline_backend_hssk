import express from 'express';
import passport from 'passport';
import xeploaisuckhoeController from './xeploaisuckhoe.controller';

export const xeploaisuckhoeRouter = express.Router();

xeploaisuckhoeRouter.post('/',passport.authenticate('jwt', { session: false }), xeploaisuckhoeController.create)
xeploaisuckhoeRouter.get('/',passport.authenticate('jwt', { session: false }), xeploaisuckhoeController.findAll);

xeploaisuckhoeRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), xeploaisuckhoeController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), xeploaisuckhoeController.delete)
  .put(passport.authenticate('jwt', { session: false }), xeploaisuckhoeController.update)
