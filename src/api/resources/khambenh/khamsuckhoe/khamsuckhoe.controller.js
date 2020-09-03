import khamsuckhoeService from './khamsuckhoe.service';
import KhamSucKhoe from './khamsuckhoe.model';
import KhamLamSang from '../khamlamsang/khamlamsang.model';
import CanLamSang from '../canlamsang/canlamsang.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = khamsuckhoeService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await KhamSucKhoe.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {khamsuckhoe: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await KhamSucKhoe.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await KhamSucKhoe.findOne({is_deleted: false, _id: id}).lean()
        .populate({path: 'canbo_id', select: 'hoten thebhyt ngaysinh'})
        .populate({path: 'dichvu.dichvu_id', select: 'madichvu tendichvu'})
        .populate({path: 'dichvu.bacsy_id', select: 'full_name'})
      if (!data) {
        return responseAction.error(res, 404, '')
      }

      // tìm khám lâm sàng và khám cận lâm sàng.
      let canlamsang_id = await CanLamSang.findOne({is_deleted: false, khamsuckhoe_id: id})
      if(canlamsang_id){
        data.canlamsang = canlamsang_id
      }else{
        let canlamsangAdd = await CanLamSang.create({
          canbo_id: data.canbo_id,
          khamsuckhoe_id: id,
          dotkhambenh_id: data.dotkhambenh_id
        })
        data.canlamsang = canlamsangAdd
      }

      // tìm khám lâm sàng và khám cận lâm sàng.
      let khamlamsang_id = await KhamLamSang.findOne({is_deleted: false, khamsuckhoe_id: id})
        .populate({path: 'tuanhoan_bacsy_id', select: 'full_name'}).populate({path: 'tuanhoan_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'tuanhoan_xeploai_id', select: 'xeploai'})
        .populate({path: 'hohap_bacsy_id', select: 'full_name'}).populate({path: 'hohap_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'hohap_xeploai_id', select: 'xeploai'})
        .populate({path: 'tieuhoa_bacsy_id', select: 'full_name'}).populate({path: 'tieuhoa_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'tieuhoa_xeploai_id', select: 'xeploai'})
        .populate({path: 'thantietnieu_bacsy_id', select: 'full_name'}).populate({path: 'thantietnieu_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'thantietnieu_xeploai_id', select: 'xeploai'})

        .populate({path: 'coxuongkhop_bacsy_id', select: 'full_name'}).populate({path: 'coxuongkhop_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'coxuongkhop_xeploai_id', select: 'xeploai'})
        .populate({path: 'thankinh_bacsy_id', select: 'full_name'}).populate({path: 'thankinh_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'thankinh_xeploai_id', select: 'xeploai'})
        .populate({path: 'tamthan_bacsy_id', select: 'full_name'}).populate({path: 'tamthan_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'tamthan_xeploai_id', select: 'xeploai'})
        .populate({path: 'ngoaikhoa_bacsy_id', select: 'full_name'}).populate({path: 'ngoaikhoa_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'ngoaikhoa_xeploai_id', select: 'xeploai'})

        .populate({path: 'sanphukhoa_bacsy_id', select: 'full_name'}).populate({path: 'sanphukhoa_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'sanphukhoa_xeploai_id', select: 'xeploai'})
        .populate({path: 'mat_bacsy_id', select: 'full_name'}).populate({path: 'mat_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'mat_xeploai_id', select: 'xeploai'})
        .populate({path: 'taimuihong_bacsy_id', select: 'full_name'}).populate({path: 'taimuihong_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'taimuihong_xeploai_id', select: 'xeploai'})
        .populate({path: 'ranghammat_bacsy_id', select: 'full_name'}).populate({path: 'ranghammat_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'ranghammat_xeploai_id', select: 'xeploai'})

        .populate({path: 'ranghammat_bacsy_id', select: 'full_name'}).populate({path: 'dalieu_benh_id', select: 'mabenh tenbenh', populate: [{path: 'chuongbenh_id', select: 'machuong'}, {path: 'gombenh_id', select: 'tengom'}, {path: 'nhombenh_id', select: 'tennhom'}, {path: 'xeploai_id', select: 'xeploai'}]}).populate({path: 'dalieu_xeploai_id', select: 'xeploai'})

      if(khamlamsang_id){
        data.khamlamsang = khamlamsang_id
      }else{
        let khamlamsangAdd = await KhamLamSang.create({
          canbo_id: data.canbo_id,
          khamsuckhoe_id: id,
          dotkhambenh_id: data.dotkhambenh_id
        })
        data.khamlamsang = khamlamsangAdd
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;

      const data = await KhamSucKhoe.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      let dataCheck = await KhamSucKhoe.findById(id).lean()
      if (!dataCheck) {
        return  responseAction.error(res, 404, '')
      }

      const { value, error } = khamsuckhoeService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      value.trangthai = dataCheck.trangthai !== -1 ? dataCheck.trangthai : 0
      if(value.xeploai_id) value.trangthai = 1;

      const data = await KhamSucKhoe.findOneAndUpdate({ _id: id }, value, { new: true });
      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },

  async themDichVu(req, res){
    try {
      const { id } = req.params;
      let {dichvu_id} = req.body;

      if(!dichvu_id || !dichvu_id.length){
        return res.status(400).json({success: 400, message: 'Mã dịch vụ là bắt buộc nhập'})
      }

      let canlamsang = await KhamSucKhoe.findOne({is_deleted: false, _id: id})
      if(!canlamsang){
        return  responseAction.error(res, 404, '');
      }

      let dataCheck = await KhamSucKhoe.findOne({_id: id, 'dichvu.dichvu_id': {$in: dichvu_id}}).populate({path: 'dichvu.dichvu_id', select: 'tendichvu'}).lean();
      if(dataCheck){
        let dichvuExist = null
        let dichvuOrg = dataCheck.dichvu
        for(let i=0; i<dichvuOrg.length;i++){
          let data = dichvuOrg[i]
          let _idDVStr = data.dichvu_id._id.toString()
          if(dichvu_id.indexOf(_idDVStr) >= 0){
            dichvuExist = data
            break;
          }
        }
        if(dichvuExist) return res.status(400).json({success: false, message: 'Dịch vụ ' + dichvuExist.dichvu_id.tendichvu + ' đã tồn tại, vui lòng kiểm tra và thử lại'});
      }


      let dichvu = dichvu_id.map(data => {
        return {dichvu_id: data, bacsy_id: req.user._id, ketqua: '', teptin: []}
      })
      // return res.json(dichvu_id)
      // tìm những dịch vụ đã tồn tại.

      var added = await canlamsang.dichvu.addToSet(...dichvu)
      await canlamsang.save()
      let dataPopulate = await canlamsang.populate({path: 'dichvu.dichvu_id'}).populate({path: 'dichvu.bacsy_id', select: 'full_name'}).execPopulate();
      let dichvuUpt = dataPopulate.dichvu
      let dataRtn = dichvuUpt.filter(data => {
        let _idDVStr = data.dichvu_id._id.toString()
        if(dichvu_id.indexOf(_idDVStr) >= 0){
          return true
        }
        return false;
      })
      return res.json(dataRtn)

    }catch (e) {
      console.error(e);
      return responseAction.error(res, 500, e.errors)
    }
  },
  async xoaDichVu(req, res){
    try {
      const { id, idDichVu } = req.params;

      let canlamsang = await KhamSucKhoe.findOne({is_deleted: false, _id: id})
      if(!canlamsang){
        return  responseAction.error(res, 404, '');
      }
      var doc = canlamsang.dichvu.id(idDichVu);
      if(!canlamsang){
        return  responseAction.error(res, 404, '');
      }
      let user_id = req.user._id
      let bacsy_id = doc.bacsy_id
      if(user_id && bacsy_id && user_id.toString() !== bacsy_id.toString()){
        return res.status(400).json({message: 'Không thể xóa dịch vụ, vì bạn không phải người kê.'})
      }
      await canlamsang.dichvu.id(idDichVu).remove();
      await canlamsang.save()
      return res.json({_id: idDichVu})

    }catch (e) {
      console.error(e);
      return responseAction.error(res, 500, e.errors)
    }
  }
};
