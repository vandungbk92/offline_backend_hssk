import express from 'express';
import passport from 'passport';
import chucvuController from './chucvu.controller';

export const chucvuRouter = express.Router();

chucvuRouter.post('/',passport.authenticate('jwt', { session: false }), chucvuController.create)
chucvuRouter.get('/',passport.authenticate('jwt', { session: false }), chucvuController.findAll);

chucvuRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), chucvuController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), chucvuController.delete)
  .put(passport.authenticate('jwt', { session: false }), chucvuController.update)
