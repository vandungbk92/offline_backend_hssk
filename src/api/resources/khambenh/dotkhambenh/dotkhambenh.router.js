import express from 'express';
import passport from 'passport';
import dotkhambenhController from './dotkhambenh.controller';

export const dotkhambenhRouter = express.Router();

dotkhambenhRouter
  .post('/', passport.authenticate('jwt', { session: false }), dotkhambenhController.create)
  .get('/', passport.authenticate('jwt', { session: false }), dotkhambenhController.findAll);

dotkhambenhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), dotkhambenhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), dotkhambenhController.delete)
  .put(passport.authenticate('jwt', { session: false }), dotkhambenhController.update);

dotkhambenhRouter.get('/:id/can-bo-kham-benh', passport.authenticate('jwt', { session: false }), dotkhambenhController.dsCanBoKhamBenh)
dotkhambenhRouter.put('/:id/can-bo-kham-benh', passport.authenticate('jwt', { session: false }), dotkhambenhController.putCanBoKhamBenh)


