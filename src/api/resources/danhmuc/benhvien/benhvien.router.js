import express from 'express';
import passport from 'passport';
import benhvienController from './benhvien.controller';

export const benhvienRouter = express.Router();

benhvienRouter.post('/',passport.authenticate('jwt', { session: false }), benhvienController.create)
benhvienRouter.get('/',passport.authenticate('jwt', { session: false }), benhvienController.findAll);

benhvienRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), benhvienController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), benhvienController.delete)
  .put(passport.authenticate('jwt', { session: false }), benhvienController.update)
