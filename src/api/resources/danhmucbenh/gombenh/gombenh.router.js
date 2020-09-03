import express from 'express';
import passport from 'passport';
import gombenhController from './gombenh.controller';

export const gombenhRouter = express.Router();

gombenhRouter.post('/upload',passport.authenticate('jwt', { session: false }), gombenhController.upload)

gombenhRouter.post('/',passport.authenticate('jwt', { session: false }), gombenhController.create)

gombenhRouter.get('/',passport.authenticate('jwt', { session: false }), gombenhController.findAll);

gombenhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), gombenhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), gombenhController.delete)
  .put(passport.authenticate('jwt', { session: false }), gombenhController.update)
