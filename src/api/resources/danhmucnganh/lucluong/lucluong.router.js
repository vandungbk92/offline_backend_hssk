import express from 'express';
import passport from 'passport';
import lucluongController from './lucluong.controller';

export const lucluongRouter = express.Router();

lucluongRouter.post('/',passport.authenticate('jwt', { session: false }), lucluongController.create)
lucluongRouter.get('/',passport.authenticate('jwt', { session: false }), lucluongController.findAll);

lucluongRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), lucluongController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), lucluongController.delete)
  .put(passport.authenticate('jwt', { session: false }), lucluongController.update)
