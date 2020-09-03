import express from 'express';
import passport from 'passport';
import chuyenkhoaController from './chuyenkhoa.controller';

export const chuyenkhoaRouter = express.Router();

chuyenkhoaRouter.post('/',passport.authenticate('jwt', { session: false }), chuyenkhoaController.create)
chuyenkhoaRouter.get('/',passport.authenticate('jwt', { session: false }), chuyenkhoaController.findAll);

chuyenkhoaRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), chuyenkhoaController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), chuyenkhoaController.delete)
  .put(passport.authenticate('jwt', { session: false }), chuyenkhoaController.update)
