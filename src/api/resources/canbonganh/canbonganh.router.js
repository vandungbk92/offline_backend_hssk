import express from 'express';
import passport from 'passport';
import canbonganhController from './canbonganh.controller';
import roleAuthorization from '../../utils/roleAuthorization';
import {ADMIN_ROLES} from "../../constant/constant";
import {checkTempFolder, multipartMiddleware} from '../../utils/fileUtils';

export const canbonganhRouter = express.Router();

canbonganhRouter.route('/')
  .post(passport.authenticate('jwt', {session: false}), canbonganhController.create)
  .get(passport.authenticate('jwt', {session: false}), roleAuthorization(ADMIN_ROLES), canbonganhController.findAll);

canbonganhRouter.route('/import').post(checkTempFolder, multipartMiddleware,
  canbonganhController.import);

canbonganhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', {session: false}), canbonganhController.findOne)
  .delete(passport.authenticate('jwt', {session: false}), canbonganhController.delete)
  .put(passport.authenticate('jwt', {session: false}), canbonganhController.update);


