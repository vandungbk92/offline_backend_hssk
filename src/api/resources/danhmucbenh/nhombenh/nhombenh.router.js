import express from 'express';
import passport from 'passport';
import nhombenhController from './nhombenh.controller';

export const nhombenhRouter = express.Router();

nhombenhRouter.post('/',passport.authenticate('jwt', { session: false }), nhombenhController.create)
nhombenhRouter.get('/',passport.authenticate('jwt', { session: false }), nhombenhController.findAll);

nhombenhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), nhombenhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), nhombenhController.delete)
  .put(passport.authenticate('jwt', { session: false }), nhombenhController.update)
