import express from 'express';
import passport from 'passport';
import tongiaoController from './tongiao.controller';

export const tongiaoRouter = express.Router();

tongiaoRouter.post('/',passport.authenticate('jwt', { session: false }), tongiaoController.create)
tongiaoRouter.get('/',passport.authenticate('jwt', { session: false }), tongiaoController.findAll);

tongiaoRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), tongiaoController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), tongiaoController.delete)
  .put(passport.authenticate('jwt', { session: false }), tongiaoController.update)
