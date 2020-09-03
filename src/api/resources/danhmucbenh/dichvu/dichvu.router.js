import express from 'express';
import passport from 'passport';
import dichvuController from './dichvu.controller';

export const dichvuRouter = express.Router();

dichvuRouter.post('/',passport.authenticate('jwt', { session: false }), dichvuController.create)
dichvuRouter.get('/',passport.authenticate('jwt', { session: false }), dichvuController.findAll);

dichvuRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), dichvuController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), dichvuController.delete)
  .put(passport.authenticate('jwt', { session: false }), dichvuController.update)
