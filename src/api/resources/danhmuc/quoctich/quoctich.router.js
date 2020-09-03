import express from 'express';
import passport from 'passport';
import quoctichController from './quoctich.controller';

export const quoctichRouter = express.Router();

quoctichRouter.post('/',passport.authenticate('jwt', { session: false }), quoctichController.create)
quoctichRouter.get('/',passport.authenticate('jwt', { session: false }), quoctichController.findAll);

quoctichRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), quoctichController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), quoctichController.delete)
  .put(passport.authenticate('jwt', { session: false }), quoctichController.update)
