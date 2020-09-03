import express from 'express';
import passport from 'passport';
import reportController from './report.controller';

export const reportRouter = express.Router();
reportRouter.get('/xep-loai', passport.authenticate('jwt', { session: false }), reportController.baocaoxeploai);
reportRouter.get('/print/kham-dinh-ky/:id', passport.authenticate('jwt', { session: false }), reportController.printKhamDinhKy);

reportRouter.get('/phan-loai', passport.authenticate('jwt', { session: false }), reportController.funcPhanLoai);
reportRouter.get('/danh-sach-phan-loai', passport.authenticate('jwt', { session: false }), reportController.funcDanhSachPhanLoai);

