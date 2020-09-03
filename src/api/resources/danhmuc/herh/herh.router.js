import express from 'express';
import passport from 'passport';
import herhController from './herh.controller';

export const herhRouter = express.Router();

herhRouter.post('/',passport.authenticate('jwt', { session: false }), herhController.create)
herhRouter.get('/',passport.authenticate('jwt', { session: false }), herhController.findAll);

herhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), herhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), herhController.delete)
  .put(passport.authenticate('jwt', { session: false }), herhController.update)
