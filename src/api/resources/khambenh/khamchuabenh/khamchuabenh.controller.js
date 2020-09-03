import khamchuabenhService from './khamchuabenh.service';
import KhamChuaBenh from './khamchuabenh.model';
import KhamSucKhoe from '../khamsuckhoe/khamsuckhoe.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import {thongTinCanBo, tinhtongtien, tudongxeploai} from './khamchuabenh.untils';

export default {
  async create(req, res) {
    try {

      // lấy danh sách khám sức khỏe:
      let a = await KhamChuaBenh.find({is_deleted:false}).lean()
      for(let i=0;i<a.length;i++){
        console.log(i, '[i]')
        let data = a[i];
        if(!data.khamsuckhoe_id){
          let b = await tudongxeploai(data)
        }
      }

      return res.json({success: false})
      // kết thúc.

      let {value, error} = khamchuabenhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        let message = error.details[0].message;
        return res.json({Code: "1", Msg: message, Ext: ""})
        // return responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra mã khám chữa bệnh, mã bệnh viên, và số thẻ bhyt đã tồn tại chưa/
      // nếu tồn tại rồi, thì cập nhật dữ liệu.
      let khamchuabenhInfo = await KhamChuaBenh.findOne({
        makcb: value.makcb,
        mabenhvien: value.mabenhvien,
        thebhyt: value.thebhyt
      }).lean();

      if (khamchuabenhInfo) {
        let khambenh = khamchuabenhInfo.khambenh ? khamchuabenhInfo.khambenh : [];
        let dieutri = khamchuabenhInfo.dieutri ? khamchuabenhInfo.dieutri : [];

        let khambenhUpt = value.khambenh ? value.khambenh : [];
        let dieutriUpt = value.dieutri ? value.dieutri : [];
        let objKhamBenh = {};
        let objDieuTri = {};

        khambenh.forEach((curr) => {
          let key = curr.makhambenh + curr.makhoa;
          objKhamBenh[key] = curr;
        });

        dieutri.forEach((curr) => {
          let key = curr.madieutri + curr.makhoa;
          objDieuTri[key] = curr;
        });
        khambenhUpt.forEach((curr) => {
          let key = curr.makhambenh + curr.makhoa;
          if (objKhamBenh[key]) {
            objKhamBenh[key] = {...objKhamBenh[key], ...curr}
          } else {
            objKhamBenh[key] = curr;
          }
        });
        dieutriUpt.forEach((curr) => {
          let key = curr.madieutri + curr.makhoa;
          if (objDieuTri[key]) {
            objDieuTri[key] = {...objDieuTri[key], ...curr}
          } else {
            objDieuTri[key] = curr;
          }
        });

        value.khambenh = Object.values(objKhamBenh);
        value.dieutri = Object.values(objDieuTri);
        const data = await KhamChuaBenh.findByIdAndUpdate(khamchuabenhInfo._id, value, {new: true});
        // tudongxeploai(data);
        return res.json({Code: "0", Msg: "Đồng bộ dữ liệu thành công", Ext: data._id});
      }
      else {
        // nếu chưa tồn tại thì thêm mới.
        value = await thongTinCanBo(value);
        const data = await KhamChuaBenh.create(value);
        tudongxeploai(data);
        return res.json({Code: "0", Msg: "Đồng bộ dữ liệu thành công", Ext: data._id});
      }
    } catch (err) {
      let message = "Có lỗi chưa xác định quá trình đồng bộ dữ liệu.";
      if (err.errors && err.errors.code) message = err.errors.code.message;
      return res.json({Code: "1", Msg: message, Ext: ""});
      // return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      options.populate = [{path: 'xeploai_id', select: 'xeploai'}]
      const data = await KhamChuaBenh.paginate(query, options);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async reportAll(req, res) {

    function calTienThuoc(khambenh) {
      let chiPhi = {
        thanhtien: 0,
        tienbnpt: 0,
        tienbh: 0
      };
      if (khambenh) {
        khambenh.forEach(kham => {
          if (kham.thuoc) {
            kham.thuoc.forEach(loaiThuoc => {
              chiPhi.thanhtien += parseFloat(loaiThuoc.thanhtien ? loaiThuoc.thanhtien : 0);
              chiPhi.tienbnpt += parseFloat(loaiThuoc.tienbnpt ? loaiThuoc.tienbnpt : 0);
              chiPhi.tienbh += parseFloat(loaiThuoc.tienbh ? loaiThuoc.tienbh : 0);
            })
          }
        })
      }
      return chiPhi;
    }

    function calTienDichVu(khambenh) {
      let chiPhi = {
        thanhtien: 0,
        tienbnpt: 0,
        tienbh: 0
      };
      if (khambenh) {
        khambenh.forEach(kham => {
          if (kham.dichvu) {
            kham.dichvu.forEach(loaiDichvu => {
              chiPhi.thanhtien += parseFloat(loaiDichvu.thanhtien ? loaiDichvu.thanhtien : 0);
              chiPhi.tienbnpt += parseFloat(loaiDichvu.tienbnpt ? loaiDichvu.tienbnpt : 0);
              chiPhi.tienbh += parseFloat(loaiDichvu.tienbh ? loaiDichvu.tienbh : 0)
            })
          }
        })
      }
      return chiPhi
    }

    function calTienDieuTri(dieutri) {
      let chiPhiThuoc = {
        thanhtien: 0,
        tienbnpt: 0,
        tienbh: 0
      };
      let chiPhiDichVu = {
        thanhtien: 0,
        tienbnpt: 0,
        tienbh: 0
      };
      if (dieutri) {
        dieutri.forEach(luotDieuTri => {
          let ylenh = luotDieuTri.ylenh;
          if (ylenh) {
            let tienThuoc = calTienThuoc(ylenh);
            let tienDichVu = calTienDichVu(ylenh);
            chiPhiThuoc.thanhtien += tienThuoc.thanhtien;
            chiPhiThuoc.tienbnpt += tienThuoc.tienbnpt;
            chiPhiThuoc.tienbh += tienThuoc.tienbh;

            chiPhiDichVu.thanhtien += tienDichVu.thanhtien;
            chiPhiDichVu.tienbnpt += tienDichVu.tienbnpt;
            chiPhiDichVu.tienbh += tienDichVu.tienbh
          }
        })
      }
      return {
        tienThuoc: chiPhiThuoc,
        tienDichVu: chiPhiDichVu
      }
    }

    function calChiPhi(eachData) {
      let tienThuoc = calTienThuoc(eachData.khambenh);
      let tienDichVu = calTienDichVu(eachData.khambenh);
      let tienDieuTri = calTienDieuTri(eachData.dieutri);
      let tongChiPhi = tienThuoc.thanhtien + tienDichVu.thanhtien + tienDieuTri.tienThuoc.thanhtien + tienDieuTri.tienDichVu.thanhtien;
      let tongBnpt = tienThuoc.tienbnpt + tienDichVu.tienbnpt + tienDieuTri.tienThuoc.tienbnpt + tienDieuTri.tienDichVu.tienbnpt;
      let tongBh = tienThuoc.tienbh + tienDichVu.tienbh + tienDieuTri.tienThuoc.tienbh + tienDieuTri.tienDichVu.tienbh;
      return {
        tienThuoc: tienThuoc,
        tienDichVu: tienDichVu,
        tienDieuTri: tienDieuTri,
        tongChiPhi: tongChiPhi,
        tongBnpt: tongBnpt,
        tongBh: tongBh
      };
    }

    try {
      let query = filterRequest(req.query, true);
      let options = optionsRequest(req.query);
      options.lean = true
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      options.populate = [{path: 'canbo_id', select: 'hoten'}, {path: 'xeploai_id', select: 'xeploai'}];
      options.select = '_id hoten makcb khambenh dieutri thebhyt xeploai_id'
      let data = await KhamChuaBenh.paginate(query, options);

      if (data.docs) {
        let tongChiPhi = {
          thanhtien: 0,
          tienbnpt: 0,
          tienbh: 0
        };
        data.docs.forEach(eachData => {
          let chiphi = calChiPhi(eachData);
          delete eachData.khambenh
          delete eachData.dieutri
          eachData.chiphi = chiphi
        });
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async reportCalAll(req, res){
    let query = filterRequest(req.query, true);
    let khamchuabenhInfo = await KhamChuaBenh.find(query).lean();
    let dataReturn = {
      thanhtien: 0,
      tienbh: 0,
      tienbnpt: 0
    }

    for(let i=0; i<khamchuabenhInfo.length; i++){
      let data = khamchuabenhInfo[i];
      let khambenh = data.khambenh ? data.khambenh : [];
      let dieutri = data.dieutri ? data.dieutri : [];

      khambenh.forEach(curr => {
        let thuoc = curr.thuoc ? curr.thuoc : []
        let dichvu = curr.dichvu ? curr.dichvu : []

        dataReturn = tinhtongtien(dataReturn, thuoc)
        dataReturn = tinhtongtien(dataReturn, dichvu)
      })

      dieutri.forEach(curr => {
        let ylenh = curr.ylenh ? curr.ylenh : []

        ylenh.forEach(current => {
          let thuoc = current.thuoc ? current.thuoc : []
          let dichvu = current.dichvu ? current.dichvu : []

          dataReturn = tinhtongtien(dataReturn, thuoc)
          dataReturn = tinhtongtien(dataReturn, dichvu)

        })
      })
    }
    dataReturn.thanhtien = parseInt(dataReturn.thanhtien)
    dataReturn.tienbh = parseInt(dataReturn.tienbh)
    dataReturn.tienbnpt = parseInt(dataReturn.tienbnpt)
    return res.json(dataReturn)
  },

  async baocao(req, res){
    // tìm báo cáo những ông nội trú, ngoại trú, và chuyển viện.
    // những ông nào có điều trị là nội trú.
    // những ông nào chỉ khám bệnh là ngoại trú.
    // những ông nào chuyển viện là có chuyển viện.

    /*let a = await KhamChuaBenh.count({is_deleted: false, dieutri : [], khambenh: { $exists: true, $not: {$size: 0}}})
    return res.json(a)*/
    // dieutri: 252
    // khambenh: 132
    // chuyenvien: 1
    // count : 384


    let query = filterRequest(req.query, true);
    let data = await KhamChuaBenh.find(query).lean();
    let dataRtn = {
      ngoaitru: 0,
      noitru: 0,
      chuyenvien: 0
    }

    data.forEach(curr => {
      let khambenh = curr.khambenh ? curr.khambenh : []
      let dieutri = curr.dieutri ? curr.dieutri : []
      let chuyenvien = curr.chuyenvien && Object.keys(curr.chuyenvien).length ? curr.chuyenvien : null

      if(chuyenvien){
        dataRtn.chuyenvien += 1
      }
      if(dieutri.length){
        dataRtn.noitru += 1
      }

      if(!dieutri.length && khambenh.length){
        dataRtn.ngoaitru += 1
      }
    })
    return res.json(dataRtn);
   /* let nhombenh  = await KhamChuaBenh.aggregate([
      { $match : {is_deleted: false} },
      {
        $group: {
          _id: null,
          ngoaitru: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {$ne: ['$khambenh', []]},
                    {$eq: ['$dieutri', []]}
                  ],
                },
                1,
                0,
              ],
            }
          },
          noitru: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {$ne: ['$dieutri', []]},
                    {$isArray: '$dieutri'}
                  ],
                },
                1,
                0,
              ],
            }
          },
          chuyenvien: {
            $sum: {
              $cond: [
                {$eq: ['$chuyenvien.mabenhvienden', undefined]},
                1,
                0,
              ],
            }
          },
        }
      }
    ])

    return res.json(nhombenh)*/
  },

  async findOne(req, res) {
    try {
      const {id} = req.params;
      const data = await KhamChuaBenh.findOne({is_deleted: false, _id: id})
        // .populate({path: 'nguoixeploai_id', select: 'full_name'})
        .populate({path: 'khamsuckhoe_id', select: 'khamchuabenh tuxeploai nguoixeploai_id thoigianxeploai xeploai_id nhombenh_id vandeluuy',
          populate: [{path: 'xeploai_id', select: 'xeploai'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'nguoixeploai_id', select: 'full_name'}]
        })

      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const {id} = req.params;
      const data = await KhamChuaBenh.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});
      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const {id} = req.params;
      const {value, error} = khamchuabenhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      // thông tin khám bệnh.
      let khamchuabenh = KhamChuaBenh.findById({_id: id});

      const data = await KhamChuaBenh.findOneAndUpdate({_id: id}, value, {new: true});
      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },

  async capnhatxeploai(req, res) {
    try {
      const {id} = req.params;
      let body = req.body;
      /*if (!body.xeploai_id) {
        return res.status(400).json({success: false, message: 'Mã xếp loại sức khỏe là bắt buộc nhập.'})
      }*/

      // lấy thông tin của KhamSucKhoe
      const khamsuckhoeInfo = await KhamSucKhoe.findById(id).lean();
      if (!khamsuckhoeInfo || !khamsuckhoeInfo.khamchuabenh_id) {
        return responseAction.error(res, 404, '')
      }
      let isCheckExist = false;
      let dataKhamChuaBenh = {}
      if(body.xeploai_id && ((khamsuckhoeInfo.xeploai_id && khamsuckhoeInfo.xeploai_id.toString() !==  body.xeploai_id) || !khamsuckhoeInfo.xeploai_id)){
        body.nguoixeploai_id = req.user._id;
        body.thoigianxeploai = new Date();

        dataKhamChuaBenh.nguoixeploai_id = req.user._id;
        dataKhamChuaBenh.tuxeploai = true;
        dataKhamChuaBenh.xeploai_id = body.xeploai_id;
        dataKhamChuaBenh.thoigianxeploai = body.thoigianxeploai;
        isCheckExist = true
      }

      const data = await KhamSucKhoe.findOneAndUpdate({_id: id}, body, {new: true})
        .populate({path: 'xeploai_id', select: 'xeploai'})
        .populate({path: 'nhombenh_id', select: 'tennhom'})
        .populate({path: 'nguoixeploai_id', select: 'full_name'})

      if(isCheckExist){
        let dataupt = await KhamChuaBenh.findOneAndUpdate({_id: khamsuckhoeInfo.khamchuabenh_id}, dataKhamChuaBenh, {new: true})
      }

      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },

  async findAllChoXuLy(req, res) {
    try {
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      query.tuxeploai = false
      const data = await KhamChuaBenh.paginate(query, options);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
