import express from 'express';
import passport from 'passport';
import phanloaikhamController from './phanloaikham.controller';

export const phanloaikhamRouter = express.Router();

phanloaikhamRouter.post('/',passport.authenticate('jwt', { session: false }), phanloaikhamController.create)
phanloaikhamRouter.get('/',passport.authenticate('jwt', { session: false }), phanloaikhamController.findAll);

phanloaikhamRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), phanloaikhamController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), phanloaikhamController.delete)
  .put(passport.authenticate('jwt', { session: false }), phanloaikhamController.update)
