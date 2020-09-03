import express from 'express';
import passport from 'passport';
import dantocController from './dantoc.controller';

export const dantocRouter = express.Router();

dantocRouter.post('/',passport.authenticate('jwt', { session: false }), dantocController.create)
dantocRouter.get('/',passport.authenticate('jwt', { session: false }), dantocController.findAll);

dantocRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), dantocController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), dantocController.delete)
  .put(passport.authenticate('jwt', { session: false }), dantocController.update)
