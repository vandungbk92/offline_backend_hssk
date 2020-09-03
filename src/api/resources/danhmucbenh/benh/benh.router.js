import express from 'express';
import passport from 'passport';
import benhController from './benh.controller';

export const benhRouter = express.Router();

benhRouter.post('/upload',passport.authenticate('jwt', { session: false }), benhController.upload)
benhRouter.post('/',passport.authenticate('jwt', { session: false }), benhController.create)
benhRouter.get('/',passport.authenticate('jwt', { session: false }), benhController.findAll);

benhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), benhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), benhController.delete)
  .put(passport.authenticate('jwt', { session: false }), benhController.update)
