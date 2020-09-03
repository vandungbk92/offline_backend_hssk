import express from 'express';
import passport from 'passport';
import canlamsangController from './canlamsang.controller';

export const canlamsangRouter = express.Router();

canlamsangRouter
  .post('/', passport.authenticate('jwt', { session: false }), canlamsangController.create)
  .get('/', passport.authenticate('jwt', { session: false }), canlamsangController.findAll);

canlamsangRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), canlamsangController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), canlamsangController.delete)
  .put(passport.authenticate('jwt', { session: false }), canlamsangController.update);


