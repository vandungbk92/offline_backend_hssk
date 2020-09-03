import express from 'express';
import passport from 'passport';
import khamlamsangController from './khamlamsang.controller';

export const khamlamsangRouter = express.Router();

khamlamsangRouter
  .post('/', passport.authenticate('jwt', { session: false }), khamlamsangController.create)
  .get('/', passport.authenticate('jwt', { session: false }), khamlamsangController.findAll);

khamlamsangRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), khamlamsangController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), khamlamsangController.delete)
  .put(passport.authenticate('jwt', { session: false }), khamlamsangController.update);

khamlamsangRouter.put('/:id/tuanhoan', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/hohap', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/tieuhoa', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/thantietnieu', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/coxuongkhop', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/thankinh', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/tamthan', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/ngoaikhoa', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/sanphukhoa', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/mat', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/taimuihong', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/ranghammat', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)
khamlamsangRouter.put('/:id/dalieu', passport.authenticate('jwt', { session: false }), khamlamsangController.updateKhoaKhamBenh)

