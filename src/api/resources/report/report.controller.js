import KhamSucKhoe from '../khambenh/khamsuckhoe/khamsuckhoe.model';
import KhamLamSang from '../khambenh/khamlamsang/khamlamsang.model';
import CanLamSang from '../khambenh/canlamsang/canlamsang.model';
import NhomBenh from '../danhmucbenh/nhombenh/nhombenh.model';
import DichVu from '../danhmucbenh/dichvu/dichvu.model';
import CanBoNganh from '../canbonganh/canbonganh.model';
import CanBo from '../canbo/canbo.model';
import XepLoaiSucKhoe from '../danhmuc/xeploaisuckhoe/xeploaisuckhoe.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from "../../utils/filterRequest";
export default {
  async baocaoxeploai(req, res) {
    try {
      let chitiet  = await KhamSucKhoe.aggregate([
        { $match : { is_deleted : false } },
        {
          $sort:{ created_at: -1 }
        },
        {
          $group: {
            _id: "$canbo_id",
            xeploai_id: { $first : "$xeploai_id" }
          }
        },
        {
          $group: {
            _id: "$xeploai_id",
            tong: { $sum : 1 }
          }
        },
        {
          $lookup: {
            from: "xeploaisuckhoes",
            localField: "_id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "xeploai_id"
          }
        },
        { $unwind : "$xeploai_id" }
      ])
      return res.json(chitiet)
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async printKhamDinhKy(req, res){
    let {id} = req.params
    // danh sách dịch vụ:
    let dichvu = await DichVu.find({is_deleted: false}, 'tendichvu').sort({thutu: 1}).lean();
    let objectDichVu = {}
    dichvu.forEach(curr => {
      let idStr = curr._id.toString()
      objectDichVu[idStr] = {
        tendichvu: curr.tendichvu,
        tyle: 0,
        soluong: 0
      }
    })

    // Phân loại sức khỏe:
    let xeploai = await XepLoaiSucKhoe.find({is_deleted: false}, 'xeploai ghichu').sort({thutu: 1}).lean();
    let objectXepLoai = {}
    xeploai.forEach(curr => {
      let idStr = curr._id.toString()
      objectXepLoai[idStr] = {
        loai_suckhoe: curr.xeploai + (curr.ghichu ? ' (' + curr.ghichu +')' : ''),
        tyle: 0,
        soluong: 0
      }
    })

    // Nhóm bệnh:
    let nhombenh = await NhomBenh.find({is_deleted: false}, 'tennhom ghichu').sort({thutu: 1}).lean();
    let objNhomBenh = {}
    nhombenh.forEach(curr => {
      let idStr = curr._id.toString()
      objNhomBenh[idStr] = {
        tennhom: `<b>${curr.tennhom}</b> : ${curr.ghichu ? curr.ghichu : ''}`,
        tyle: 0,
        soluong: 0
      }
    })

    // tạo objBMI = {}
    let objBMI = {
      nguoigay: {
        tenchiso: 'Người gầy (<18)',
        soluong: 0,
        tyle: 0
      },
      nguoibinhthuong: {
        tenchiso: 'Người bình thường (18-24,9)',
        soluong: 0,
        tyle: 0
      },
      nguoibeophi: {
        tenchiso: 'Người béo phì (≥25)',
        soluong: 0,
        tyle: 0
      }
    }

    let chiso_bmi = {
      "nguoigay_soluong": 0,
      "nguoigay_tyle": 0,
      "nguoibinhthuong_soluong": 0,
      "nguoibinhthuong_tyle": 0,
      "nguoibeophi_soluong": 0,
      "nguoibeophi_tyle": 0
    }

    // lấy danh sách khám sức khỏe của bệnh nhân.
    let khamsuckhoeList = await KhamSucKhoe.find({is_deleted: false, dotkhambenh_id: id})
      .populate({path: 'dichvu.dichvu_id', select: 'tendichvu'})
      .populate({path: 'nhombenh_id', select: 'tennhom'}).lean();

    // lấy danh sách khám cận lâm sàng bệnh nhân.
    let canlamsangList = await CanLamSang.find({dotkhambenh_id: id})
      .populate({path: 'khamsuckhoe_id', select: 'huyetap tuoi'})
      .populate({path: 'canbo_id', select: 'gioitinh'}).lean()

    let tongsodangky = khamsuckhoeList.length;
    let tongsodikham = 0;

    // danh sách khám lâm sàng:

    // ============================================== foreach dữ liệu kham bệnh. =======================================
    khamsuckhoeList.forEach(curr => {
      // kiếm tra quân số đi khám
      if(curr.trangthai !== -1){
        tongsodikham += 1;
      }

      if(curr.bmi){
        if(parseFloat(curr.bmi) < 18){
          chiso_bmi.nguoigay_soluong += 1
        }else if(parseFloat(curr.bmi) >= 25){
          chiso_bmi.nguoibeophi_soluong += 1;
        }else{
          chiso_bmi.nguoibinhthuong_soluong += 1;
        }
      }

      // kiểm tra số lượng Xếp loại.
      if(curr.xeploai_id && objectXepLoai.hasOwnProperty(curr.xeploai_id.toString())){
        objectXepLoai[curr.xeploai_id.toString()]['soluong'] += 1;
      }
      // kết thúc kiểm tra số lượng dịch vụ.

      // kiểm tra số lượng dịch vụ.
      let dsdichvu = curr.dichvu ? curr.dichvu : [];
      dsdichvu.forEach(dichvu => {
        let dichvu_id = dichvu.dichvu_id
        let _idDichVuStr = dichvu_id._id.toString()
        if(objectDichVu.hasOwnProperty(_idDichVuStr)){
          objectDichVu[_idDichVuStr].soluong += 1
        }else{
          objectDichVu[_idDichVuStr] = {
            tendichvu: dichvu_id.tendichvu,
            tyle: 0,
            soluong: 1
          }
        }
      })
      // kết thúc kiểm tra số lượng dịch vụ.


      // kiểm tra nhóm bệnh
      let dsnhombenh = curr.nhombenh_id ? curr.nhombenh_id : [];
      dsnhombenh.forEach(nhombenh => {
        let _idNhomBenhStr = nhombenh._id.toString();
        if(objNhomBenh.hasOwnProperty(_idNhomBenhStr)){
          objNhomBenh[_idNhomBenhStr].soluong += 1
        }else{
          objNhomBenh[_idNhomBenhStr] = {
            tennhom: nhombenh.tennhom,
            tyle: 0,
            soluong: 1
          }
        }
      })
      // kết thúc kiểm tra nhóm bệnh
    })

    let tyledikham = tongsodangky !== 0 ? (tongsodikham/tongsodangky * 100).toFixed(2) : 0;

    let chitietdichvu = Object.values(objectDichVu);
    let phanloai_suckhoe = Object.values(objectXepLoai);

    let thongke_benhtat = Object.values(objNhomBenh);
    let thongke_soca = [
      { value: '- Tổng số đăng ký khám là ' + tongsodangky + ' đc'},
      { value: '- Tổng số đến khám bệnh ' + tongsodikham + ' đc, chiếm ' + tyledikham + '%' },
    ]
    if(tongsodangky !== 0){
      chitietdichvu = chitietdichvu.map(data => {
        data.tyle = +(data.soluong / tongsodangky * 100).toFixed(2)
        thongke_soca = [...thongke_soca, {
          value: `- Tổng số ca khám ${data.tendichvu}: ${data.soluong} ca = ${data.tyle}%`
        }]
        return data
      });

      phanloai_suckhoe = phanloai_suckhoe.map(data => {
        data.tyle = +(data.soluong / tongsodangky * 100).toFixed(2)
        return data
      })

      chiso_bmi.nguoibinhthuong_tyle = +(chiso_bmi.nguoibinhthuong_soluong / tongsodangky * 100).toFixed(2)
      chiso_bmi.nguoibeophi_tyle = +(chiso_bmi.nguoibeophi_soluong / tongsodangky * 100).toFixed(2)
      chiso_bmi.nguoigay_tyle = +(chiso_bmi.nguoigay_soluong / tongsodangky * 100).toFixed(2)


      thongke_benhtat = thongke_benhtat.map(data => {
        data.tyle = +(data.soluong / tongsodangky * 100).toFixed(2)
        return data
      })

    }
    // ============================================== kết thúc foreach dữ liệu. ========================================


    // ============================================== foreach dữ liệu cận lâm sàng =====================================
    let objRoiLoan = {
      glucose: {
        benh: '5,6<Glucose<7,0 mmol/l',
        soluong: 0,
        tyle: 0
      },
      glucosemax: {
        benh: 'Glucose ≥ 7,0 mmol/l',
        soluong: 0,
        tyle: 0
      },
      cholesteroltp: {
        benh: 'Cholesterol > 5,1 mmol/l',
        soluong: 0,
        tyle: 0
      },
      triglixerit: {
        benh: 'Triglycerid > 1,88 mmol/l',
        soluong: 0,
        tyle: 0
      },
      aciduric: {
        benh: 'Acid uric > 420 µmol/l',
        soluong: 0,
        tyle: 0
      }
    }

    let objNguongGlucose = {
      glucose1: {
        ten: '6,5- 7 mmol/l',
        soluong: 0,
        tyle: 0
      },
      glucose2: {
        ten: '7- 8mmol/l',
        soluong: 0,
        tyle: 0
      },
      glucose3: {
        ten: '8- 9 mmol/l',
        soluong: 0,
        tyle: 0
      },
      glucose4: {
        ten: '>9 mmol/l',
        soluong: 0,
        tyle: 0
      }
    }

    let objBang4 = {
      co: {
        ten: 'Có',
        cholesterol: 0,
        tyle_cholesterol: 0,
        triglixerit: 0,
        tyle_triglycerid: 0,
        chlestrigly: 0,
        tyle_cholestrigly: 0,

        tang_aciduric: 0,
        tyle_tang_aciduric: 0,
        tang_cholesuric: 0,
        tyle_tang_cholesuric: 0,
        roiloandungnap: 0,
        tyle_roiloandungnap: 0
      },
      khong: {
        ten: 'Không',
        cholesterol: 0,
        tyle_cholesterol: 0,
        triglycerid: 0,
        tyle_triglycerid: 0,
        cholestrigly: 0,
        tyle_cholestrigly: 0,

        tang_aciduric: 0,
        tyle_tang_aciduric: 0,
        tang_cholesuric: 0,
        tyle_tang_cholesuric: 0,
        roiloandungnap: 0,
        tyle_roiloandungnap: 0
      }
    }

    let objBang6 = {
      tuoi35: {
        ten: '≤ 35',
        soluong_huyetap: 0,
        tyle_huyetap: 0,
        soluong_glucose: 0,
        tyle_glucose: 0,
        soluong_cholesterol: 0,
        tyle_cholesterol: 0,
        soluong_triglycerid: 0,
        tyle_triglycerid: 0,
        soluong_axituric: 0,
        tyle_aciduric: 0
      },
      tuoi3646: {
        ten: '36-46',
        soluong_huyetap: 0,
        tyle_huyetap: 0,
        soluong_glucose: 0,
        tyle_glucose: 0,
        soluong_cholesterol: 0,
        tyle_cholesterol: 0,
        soluong_triglycerid: 0,
        tyle_triglycerid: 0,
        soluong_axituric: 0,
        tyle_aciduric: 0
      },
      tuoi4757: {
        ten: '47-57',
        soluong_huyetap: 0,
        tyle_huyetap: 0,
        soluong_glucose: 0,
        tyle_glucose: 0,
        soluong_cholesterol: 0,
        tyle_cholesterol: 0,
        soluong_triglycerid: 0,
        tyle_triglycerid: 0,
        soluong_axituric: 0,
        tyle_aciduric: 0
      },
      tuoi57: {
        ten: '>57',
        soluong_huyetap: 0,
        tyle_huyetap: 0,
        soluong_glucose: 0,
        tyle_glucose: 0,
        soluong_cholesterol: 0,
        tyle_cholesterol: 0,
        soluong_triglycerid: 0,
        tyle_triglycerid: 0,
        soluong_axituric: 0,
        tyle_aciduric: 0
      }
    }

    let totalCanLamSang = 0
    canlamsangList.forEach(curr => {
      let glucose = curr.glucose ? curr.glucose : 0
      let cholesteroltp = curr.cholesteroltp ? curr.cholesteroltp : 0
      let triglixerit = curr.triglixerit ? curr.triglixerit : 0
      let aciduric = curr.aciduric ? curr.aciduric : 0
      if(curr.soluonghongcau || curr.soluongbachcau || curr.tieucau || glucose || cholesteroltp || triglixerit || aciduric
      || curr.huyetsacto || curr.huyetsacto){
        totalCanLamSang += 1;
        if(glucose < 7 && glucose > 5.6){
          objRoiLoan['glucose']['soluong'] += 1;
        }else if(glucose > 7){
          objRoiLoan['glucosemax']['soluong'] += 1;
        }

        if(cholesteroltp >= 7){
          objRoiLoan['cholesteroltp']['soluong'] += 1;
        }

        if(triglixerit > 1.88){
          objRoiLoan['triglixerit']['soluong'] += 1;
        }

        if(aciduric > 420){
          objRoiLoan['aciduric']['soluong'] += 1;
        }

        if(glucose > 6.5 && glucose < 7){
          objNguongGlucose['glucose'].soluong += 1;
        }else if(glucose >= 7 && glucose < 8){
          objNguongGlucose['glucose2'].soluong += 1;
        }else if(glucose >= 8 && glucose < 9){
          objNguongGlucose['glucose3'].soluong += 1;
        }else if(glucose >= 9){
          objNguongGlucose['glucose4'].soluong += 1;
        }
      }


      let khamsuckhoe_id = curr.khamsuckhoe_id

      // dữ liệu phân loại tuổi.
      let loai_tuoi = '';
      if(khamsuckhoe_id.tuoi <= 35){
        loai_tuoi = 'tuoi35'
      }else if(khamsuckhoe_id.tuoi >= 36 && khamsuckhoe_id.tuoi <= 46){
        loai_tuoi = 'tuoi3646'
      }else if(khamsuckhoe_id.tuoi >= 47 && khamsuckhoe_id.tuoi <= 57){
        loai_tuoi = 'tuoi4757'
      }else if(khamsuckhoe_id.tuoi > 57){
        loai_tuoi = 'tuoi57'
      }
      if(loai_tuoi){
        if(khamsuckhoe_id.huyetap >= 140 || khamsuckhoe_id.huyetap <= 90){
          objBang6[loai_tuoi]['soluong_huyetap'] += 1
        }
        if(glucose > 6.4){
          objBang6[loai_tuoi]['soluong_glucose'] += 1
        }
        if(cholesteroltp > 6.4){
          objBang6[loai_tuoi]['soluong_cholesterol'] += 1
        }
        if(triglixerit > 6.4){
          objBang6[loai_tuoi]['soluong_triglycerid'] += 1
        }
        if(aciduric > 6.4){
          objBang6[loai_tuoi]['soluong_axituric'] += 1
        }
      }

      // dữ liệu rối loạn dung nạp
      if(cholesteroltp && cholesteroltp > 5.2 && cholesteroltp <3.9){
        objBang4['co'].cholesterol += 1
      }else{
        objBang4['khong'].cholesterol += 1
      }

      if(triglixerit && triglixerit > 1.88 && triglixerit < 0.46){
        objBang4['co'].triglixerit += 1
      }else{
        objBang4['khong'].triglixerit += 1
      }

      if(triglixerit && triglixerit > 1.88 && triglixerit < 0.46 && cholesteroltp && cholesteroltp > 5.2 && cholesteroltp <3.9){
        objBang4['co'].chlestrigly += 1
      }else{
        objBang4['khong'].chlestrigly += 1
      }
      let canbo_id = curr.canbo_id
      if(canbo_id) {
        // phái nữ.
        if((aciduric > 360 && canbo_id.gioitinh === 'FEMALE') || (aciduric > 420 && canbo_id.gioitinh === 'MALE')){
          objBang4['co'].tang_aciduric += 1;
          if(cholesteroltp && cholesteroltp > 5.2 ){
            objBang4['co'].cholesterol += 1
          }else{
            objBang4['khong'].tang_cholesuric += 1
          }
        }else{
          objBang4['khong'].tang_aciduric += 1
          objBang4['khong'].tang_cholesuric += 1
        }
      }

    })
    let benh_roiloan_chuyenhoa = Object.values(objRoiLoan);
    let nguongglocose = Object.values(objNguongGlucose);
    let phanbotuoi = Object.values(objBang6)
    let roiloandungnap = Object.values(objBang4)
    if(tongsodangky > 0){
      phanbotuoi = phanbotuoi.map(data => {
        data.tyle_huyetap= +(data.soluong_huyetap / tongsodangky * 100).toFixed(2)
        data.tyle_glucose= +(data.soluong_glucose / tongsodangky * 100).toFixed(2)
        data.tyle_cholesterol= +(data.soluong_cholesterol / tongsodangky * 100).toFixed(2)
        data.tyle_triglycerid= +(data.soluong_triglycerid / tongsodangky * 100).toFixed(2)
        data.tyle_aciduric= +(data.soluong_axituric / tongsodangky * 100).toFixed(2)
        return data
      })

      roiloandungnap = roiloandungnap.map(data => {
        data.tyle_cholesterol= +(data.cholesterol / tongsodangky * 100).toFixed(2)
        data.tyle_triglycerid= +(data.triglixerit / tongsodangky * 100).toFixed(2)
        data.tyle_cholestrigly= +(data.chlestrigly / tongsodangky * 100).toFixed(2);

        data.tyle_tang_aciduric= +(data.tang_aciduric / tongsodangky * 100).toFixed(2)
        data.tyle_tang_cholesuric= +(data.tang_cholesuric / tongsodangky * 100).toFixed(2)
        data.tyle_roiloandungnap= +(data.roiloandungnap / tongsodangky * 100).toFixed(2)
        return data
      })
    }
    if(totalCanLamSang > 0){

      benh_roiloan_chuyenhoa = benh_roiloan_chuyenhoa.map(data => {
        data.tyle = +(data.soluong / totalCanLamSang * 100).toFixed(2)
        return data
      });


      nguongglocose = nguongglocose.map(data => {
        data.tyle = +(data.soluong / totalCanLamSang * 100).toFixed(2)
        return data
      });

    }
    // ============================================== Kết thúc foreach dữ liệu cận lâm sàng ============================

    return res.json({thongke_soca, phanloai_suckhoe, chiso_bmi, thongke_benhtat, benh_roiloan_chuyenhoa, roiloandungnap, nguongglocose, phanbotuoi});
  },

  async funcPhanLoai(req, res) {
    try {
      //điều kiện tìm kiếm.
      let query = filterRequest(req.query, true);

      let queryKhamSucKhoe = {is_deleted: false};

      let {capbac_id, donvi_id, lucluong_id, chucvu_id} = req.query

      // danh sách cán bộ nghanh.
      if(capbac_id || donvi_id || lucluong_id || chucvu_id){
        let queryCanBoNghanh = {is_deleted: false}
        if(capbac_id) queryCanBoNghanh.capbac_id = capbac_id
        if(donvi_id) queryCanBoNghanh.donvi_id = donvi_id
        if(lucluong_id) queryCanBoNghanh.lucluong_id = lucluong_id
        if(chucvu_id) queryCanBoNghanh.chucvu_id = chucvu_id

        let canbo = await CanBoNganh.find(queryCanBoNghanh).lean().distinct('canbo_id');
        if(!canbo.length){
          return res.json({success: false})
        }else{
          queryKhamSucKhoe.canbo_id = {$in: canbo}
        }
      }

      let {hoten, thebhyt, gioitinh} = query
      if(hoten || thebhyt || gioitinh){
        let queryCanBo = {is_deleted: false}
        if(hoten) queryCanBo.hoten = hoten
        if(thebhyt) queryCanBo.thebhyt = thebhyt
        if(gioitinh) queryCanBo.gioitinh = gioitinh
        if(queryKhamSucKhoe.hasOwnProperty('canbo_id')){
          queryCanBo._id = queryKhamSucKhoe.canbo_id
        }
        let canbo = await CanBo.find(queryCanBo).lean().distinct('_id');
        if(!canbo.length){
          return res.json({success: false})
        }else{
          queryKhamSucKhoe.canbo_id = {$in: canbo}
        }
      }

      let {created_at} = query
      if(created_at) queryKhamSucKhoe.created_at = created_at

      let xeploaisuckhoe  = await KhamSucKhoe.aggregate([
        { $match : queryKhamSucKhoe },
        {
          $sort:{ created_at: -1 }
        },
        {
          $group: {
            _id: "$canbo_id",
            xeploai_id: { $first : "$xeploai_id" }
          }
        },
        {
          $group: {
            _id: "$xeploai_id",
            tong: { $sum : 1 }
          }
        }
        /*{
          $lookup: {
            from: "xeploaisuckhoes",
            localField: "_id",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "xeploai_id"
          }
        },
        { $unwind : "$xeploai_id" },
        { $sort : { 'xeploai_id.thutu' : 1 } },
        {
          $project: {
            _id: 1,
            tong: 1,
            'xeploai_id._id': 1,
            'xeploai_id.xeploai': 1

          }
        }*/
      ])

      let nhombenh  = await KhamSucKhoe.aggregate([
        { $match : queryKhamSucKhoe },
        {
          $sort:{ created_at: -1 }
        },
        {
          $group: {
            _id: "$canbo_id",
            nhombenh_id: { $first : "$nhombenh_id" }
          }
        },
        { $unwind : "$nhombenh_id" },
        {
          $group: {
            _id: "$nhombenh_id",
            tong: { $sum : 1 }
          }
        },
        /*{
          $lookup: {
            from: "nhombenhs",
            localField: "_id",
            foreignField: "_id",
            as: "nhombenh_id"
          }
        },
        { $unwind : "$nhombenh_id" },
        { $sort : { 'nhombenh_id.thutu' : 1, 'nhombenh_id.created_at': -1 } },
        {
          $project: {
            _id: 1,
            'nhombenh_id._id': 1,
            'nhombenh_id.tennhom': 1,
            tong: 1
          }
        },*/
      ])

      // danh sach xeploai:
      let objXepLoai = {}
      xeploaisuckhoe.filter(data => {
        if(data._id){
          let _idStr = data._id.toString()
          objXepLoai[_idStr] = data.tong
        }
      })
      let dsxeploai = await XepLoaiSucKhoe.find({is_deleted: false}, 'xeploai ghichu').sort({thutu: 1, created_at: -1}).lean();
      dsxeploai = dsxeploai.map(data => {
        let _idStr = data._id.toString()
        if(objXepLoai.hasOwnProperty(_idStr)) data.tong = objXepLoai[_idStr]
        else data.tong = 0
        return data
      })

      // danh sach nhoms benh:
      let objNhomBenh = {}
      nhombenh.filter(data => {
        if(data._id){
          let _idStr = data._id.toString()
          objNhomBenh[_idStr] = data.tong
        }
      })
      let dsNhomBenh = await NhomBenh.find({is_deleted: false}, 'tennhom ghichu').sort({thutu: 1, created_at: -1}).lean();
      dsNhomBenh = dsNhomBenh.map(data => {
        let _idStr = data._id.toString()
        if(objNhomBenh.hasOwnProperty(_idStr)) data.tong = objNhomBenh[_idStr]
        else data.tong = 0
        return data
      })

      return res.json({xeploai: dsxeploai, nhombenh: dsNhomBenh})
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async funcDanhSachPhanLoai(req, res) {
    try {
      //điều kiện tìm kiếm.
      let query = filterRequest(req.query, true);

      let queryKhamSucKhoe = {is_deleted: false};

      let {capbac_id, donvi_id, lucluong_id, chucvu_id} = req.query

      // danh sách cán bộ nghanh.
      if(capbac_id || donvi_id || lucluong_id || chucvu_id){
        let queryCanBoNghanh = {is_deleted: false}
        if(capbac_id) queryCanBoNghanh.capbac_id = capbac_id
        if(donvi_id) queryCanBoNghanh.donvi_id = donvi_id
        if(lucluong_id) queryCanBoNghanh.lucluong_id = lucluong_id
        if(chucvu_id) queryCanBoNghanh.chucvu_id = chucvu_id

        let canbo = await CanBoNganh.find(queryCanBoNghanh).lean().distinct('canbo_id');
        if(!canbo.length){
          return res.json({success: false})
        }else{
          queryKhamSucKhoe.canbo_id = {$in: canbo}
        }
      }

      let {hoten, thebhyt, gioitinh} = query
      if(hoten || thebhyt || gioitinh){
        let queryCanBo = {is_deleted: false}
        if(hoten) queryCanBo.hoten = hoten
        if(thebhyt) queryCanBo.thebhyt = thebhyt
        if(gioitinh) queryCanBo.gioitinh = gioitinh
        if(queryKhamSucKhoe.hasOwnProperty('canbo_id')){
          queryCanBo._id = queryKhamSucKhoe.canbo_id
        }
        let canbo = await CanBo.find(queryCanBo).lean().distinct('_id');
        if(!canbo.length){
          return res.json({success: false})
        }else{
          queryKhamSucKhoe.canbo_id = {$in: canbo}
        }
      }

      let {created_at} = query
      if(created_at) queryKhamSucKhoe.created_at = created_at

      if(query.xeploai_id) queryKhamSucKhoe.xeploai_id = query.xeploai_id
      if(query.nhombenh_id) queryKhamSucKhoe.nhombenh_id = query.nhombenh_id
      let options = optionsRequest(req.query);
      options.populate = [{path: 'xeploai_id', select: 'xeploai'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'canbo_id', select: 'hoten thebhyt'}, { path: 'khamchuabenh_id', select: 'thebhyt' }]
      let khamsuckhoe  = await KhamSucKhoe.paginate(queryKhamSucKhoe, options)
       
      return res.json(khamsuckhoe)
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
