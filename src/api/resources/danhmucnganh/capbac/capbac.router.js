import express from 'express';
import passport from 'passport';
import capbacController from './capbac.controller';

export const capbacRouter = express.Router();

capbacRouter.post('/',passport.authenticate('jwt', { session: false }), capbacController.create)
capbacRouter.get('/',passport.authenticate('jwt', { session: false }), capbacController.findAll);

capbacRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), capbacController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), capbacController.delete)
  .put(passport.authenticate('jwt', { session: false }), capbacController.update)
