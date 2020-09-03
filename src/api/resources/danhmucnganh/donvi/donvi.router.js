import express from 'express';
import passport from 'passport';
import donviController from './donvi.controller';

export const donviRouter = express.Router();

donviRouter.post('/',passport.authenticate('jwt', { session: false }), donviController.create)
donviRouter.get('/',passport.authenticate('jwt', { session: false }), donviController.findAll);

donviRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), donviController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), donviController.delete)
  .put(passport.authenticate('jwt', { session: false }), donviController.update)
