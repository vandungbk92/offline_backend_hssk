import express from 'express';
import { userRouter } from './resources/user/user.router';
import { faqsRouter } from './resources/faqs';
import { settingRouter } from './resources/setting/setting.router';

// danh mục
import { phuongxaRouter } from './resources/danhmuc/phuongxa/phuongxa.router';
import { quanhuyenRouter } from './resources/danhmuc/quanhuyen/quanhuyen.router';
import { tinhthanhRouter } from './resources/danhmuc/tinhthanh/tinhthanh.router';
import { trinhdoRouter } from './resources/danhmuc/trinhdo/trinhdo.router';
import { dantocRouter } from './resources/danhmuc/dantoc/dantoc.router';
import { quoctichRouter } from './resources/danhmuc/quoctich/quoctich.router';
import { nhommauRouter } from './resources/danhmuc/nhommau/nhommau.router';
import { qhgiadinhRouter } from './resources/danhmuc/qhgiadinh/qhgiadinh.router';
import { tongiaoRouter } from './resources/danhmuc/tongiao/tongiao.router';
import { xeploaisuckhoeRouter } from './resources/danhmuc/xeploaisuckhoe/xeploaisuckhoe.router';
import { phanloaikhamRouter } from './resources/danhmuc/phanloaikham/phanloaikham.router';
import { chuyenkhoaRouter } from './resources/danhmuc/chuyenkhoa/chuyenkhoa.router';
import { herhRouter } from './resources/danhmuc/herh/herh.router';

import { capbacRouter } from './resources/danhmucnganh/capbac/capbac.router';
import { chucvuRouter } from './resources/danhmucnganh/chucvu/chucvu.router';
import { donviRouter } from './resources/danhmucnganh/donvi/donvi.router';
import { lucluongRouter } from './resources/danhmucnganh/lucluong/lucluong.router';

import { nhombenhRouter } from './resources/danhmucbenh/nhombenh/nhombenh.router';
import { gombenhRouter } from './resources/danhmucbenh/gombenh/gombenh.router';
import { chuongbenhRouter } from './resources/danhmucbenh/chuongbenh/chuongbenh.router';
import { benhRouter } from './resources/danhmucbenh/benh/benh.router';
import { dichvuRouter } from './resources/danhmucbenh/dichvu/dichvu.router';

import { canboRouter } from './resources/canbo/canbo.router';
import { canbonganhRouter } from './resources/canbonganh/canbonganh.router';

import { khamchuabenhRouter } from './resources/khambenh/khamchuabenh/khamchuabenh.router';
import { dotkhambenhRouter } from './resources/khambenh/dotkhambenh/dotkhambenh.router';
import { khamsuckhoeRouter } from './resources/khambenh/khamsuckhoe/khamsuckhoe.router';
import { khamlamsangRouter } from './resources/khambenh/khamlamsang/khamlamsang.router';
import { canlamsangRouter } from './resources/khambenh/canlamsang/canlamsang.router';
import { benhvienRouter } from './resources/danhmuc/benhvien/benhvien.router';
import { reportRouter } from './resources/report/report.router';


export const restRouter = express.Router();
restRouter.use('/users', userRouter);
restRouter.use('/setting', settingRouter);
restRouter.use('/tinh-thanh', tinhthanhRouter);
restRouter.use('/quan-huyen', quanhuyenRouter);
restRouter.use('/phuong-xa', phuongxaRouter);
restRouter.use('/xep-loai-suc-khoe', xeploaisuckhoeRouter);
restRouter.use('/phan-loai-kham', phanloaikhamRouter);
restRouter.use('/chuyen-khoa', chuyenkhoaRouter);

restRouter.use('/trinh-do', trinhdoRouter);
restRouter.use('/dan-toc', dantocRouter);
restRouter.use('/quoc-tich', quoctichRouter);
restRouter.use('/nhom-mau', nhommauRouter);
restRouter.use('/qh-gia-dinh', qhgiadinhRouter);
restRouter.use('/ton-giao', tongiaoRouter);
restRouter.use('/he-rh', herhRouter);

restRouter.use('/cap-bac', capbacRouter);
restRouter.use('/chuc-vu', chucvuRouter);
restRouter.use('/don-vi', donviRouter);
restRouter.use('/luc-luong', lucluongRouter);

restRouter.use('/nhom-benh', nhombenhRouter);
restRouter.use('/gom-benh', gombenhRouter);
restRouter.use('/chuong-benh', chuongbenhRouter);
restRouter.use('/benh', benhRouter);
restRouter.use('/dich-vu', dichvuRouter);

restRouter.use('/can-bo', canboRouter);
restRouter.use('/can-bo-nganh', canbonganhRouter);
restRouter.use('/kham-chua-benh', khamchuabenhRouter);
restRouter.use('/dot-kham-benh', dotkhambenhRouter);
restRouter.use('/kham-suc-khoe', khamsuckhoeRouter);
restRouter.use('/kham-lam-sang', khamlamsangRouter);
restRouter.use('/can-lam-sang', canlamsangRouter);
restRouter.use('/benh-vien', benhvienRouter);
restRouter.use('/bao-cao', reportRouter);

