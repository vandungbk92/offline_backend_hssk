import express from 'express';
import passport from 'passport';
import nhommauController from './nhommau.controller';

export const nhommauRouter = express.Router();

nhommauRouter.post('/',passport.authenticate('jwt', { session: false }), nhommauController.create)
nhommauRouter.get('/',passport.authenticate('jwt', { session: false }), nhommauController.findAll);

nhommauRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), nhommauController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), nhommauController.delete)
  .put(passport.authenticate('jwt', { session: false }), nhommauController.update)
