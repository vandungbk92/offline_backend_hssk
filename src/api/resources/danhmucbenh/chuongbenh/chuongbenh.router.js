import express from 'express';
import passport from 'passport';
import chuongbenhController from './chuongbenh.controller';

export const chuongbenhRouter = express.Router();

chuongbenhRouter.post('/',passport.authenticate('jwt', { session: false }), chuongbenhController.create)
chuongbenhRouter.get('/',passport.authenticate('jwt', { session: false }), chuongbenhController.findAll);

chuongbenhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), chuongbenhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), chuongbenhController.delete)
  .put(passport.authenticate('jwt', { session: false }), chuongbenhController.update)

chuongbenhRouter.get('/:id/gom-benh', passport.authenticate('jwt', { session: false }), chuongbenhController.getAllGomBenhById)
