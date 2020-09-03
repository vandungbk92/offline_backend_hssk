import express from 'express';
import passport from 'passport';
import khamsuckhoeController from './khamsuckhoe.controller';

export const khamsuckhoeRouter = express.Router();

khamsuckhoeRouter
  .post('/', passport.authenticate('jwt', { session: false }), khamsuckhoeController.create)
  .get('/', passport.authenticate('jwt', { session: false }), khamsuckhoeController.findAll);

khamsuckhoeRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), khamsuckhoeController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), khamsuckhoeController.delete)
  .put(passport.authenticate('jwt', { session: false }),  khamsuckhoeController.update);

khamsuckhoeRouter.post('/:id/dich-vu',
  passport.authenticate('jwt', { session: false }), khamsuckhoeController.themDichVu)

khamsuckhoeRouter.delete('/:id/dich-vu/:idDichVu',
  passport.authenticate('jwt', { session: false }), khamsuckhoeController.xoaDichVu)


