import express from 'express';
import passport from 'passport';
import trinhdoController from './trinhdo.controller';

export const trinhdoRouter = express.Router();

trinhdoRouter.post('/',passport.authenticate('jwt', { session: false }), trinhdoController.create)
trinhdoRouter.get('/',passport.authenticate('jwt', { session: false }), trinhdoController.findAll);

trinhdoRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), trinhdoController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), trinhdoController.delete)
  .put(passport.authenticate('jwt', { session: false }), trinhdoController.update)
