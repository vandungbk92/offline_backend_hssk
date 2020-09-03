import express from 'express';
import passport from 'passport';
import qhgiadinhController from './qhgiadinh.controller';

export const qhgiadinhRouter = express.Router();

qhgiadinhRouter.post('/',passport.authenticate('jwt', { session: false }), qhgiadinhController.create)
qhgiadinhRouter.get('/',passport.authenticate('jwt', { session: false }), qhgiadinhController.findAll);

qhgiadinhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), qhgiadinhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), qhgiadinhController.delete)
  .put(passport.authenticate('jwt', { session: false }), qhgiadinhController.update)
