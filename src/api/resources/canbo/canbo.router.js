import express from 'express';
import passport from 'passport';
import canboController from './canbo.controller';
import roleAuthorization from '../../utils/roleAuthorization';
import {ADMIN_ROLES} from "../../constant/constant";

export const canboRouter = express.Router();
canboRouter.get('/danh-sach-kham-benh', passport.authenticate('jwt', { session: false }), canboController.dsCanBoKhamBenh)
canboRouter.get('/print/:id', passport.authenticate('jwt', { session: false }), canboController.findOnePrint)
canboRouter.get('/:id/lich-su', passport.authenticate('jwt', { session: false }), canboController.funcLichSuKhamBenh)
canboRouter.route('/')
  .post(passport.authenticate('jwt', { session: false }), canboController.create)
  .get(passport.authenticate('jwt', { session: false }), canboController.findAll);

canboRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), canboController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), canboController.delete)
  .put(passport.authenticate('jwt', { session: false }), canboController.update);

