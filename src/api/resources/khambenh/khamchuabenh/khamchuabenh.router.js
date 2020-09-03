import express from 'express';
import passport from 'passport';
import khamchuabenhController from './khamchuabenh.controller';

export const khamchuabenhRouter = express.Router();

khamchuabenhRouter
  .post('/', khamchuabenhController.create)
  .get('/', passport.authenticate('jwt', {session: false}), khamchuabenhController.findAll);

khamchuabenhRouter
  .get('/chi-tiet-chi-phi', passport.authenticate('jwt', {session: false}), khamchuabenhController.reportAll);

khamchuabenhRouter.get('/chi-phi', passport.authenticate('jwt', {session: false}), khamchuabenhController.reportCalAll);
khamchuabenhRouter.get('/phan-loai-kham', passport.authenticate('jwt', {session: false}), khamchuabenhController.baocao);

khamchuabenhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', {session: false}), khamchuabenhController.findOne)
  .delete(passport.authenticate('jwt', {session: false}), khamchuabenhController.delete)
  .put(passport.authenticate('jwt', {session: false}), khamchuabenhController.update);

khamchuabenhRouter.put('/kham-suc-khoe/:id/xep-loai-suc-khoe', passport.authenticate('jwt', {session: false}), khamchuabenhController.capnhatxeploai)
khamchuabenhRouter.get('/cho-phan-loai', passport.authenticate('jwt', {session: false}), khamchuabenhController.findAllChoXuLy)
