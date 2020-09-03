import khamlamsangService from './khamlamsang.service';
import KhamLamSang from './khamlamsang.model';
import Benh from '../../danhmucbenh/benh/benh.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import {thongTinKhoaKhamBenh} from "./khamlamsang.untils";
import {uptTrangThaiKSK} from "../khamsuckhoe/khamsuckhoe.untils";

export default {
  async create(req, res) {
    try {
      const { value, error } = khamlamsangService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }

      const data = await KhamLamSang.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {khamlamsang: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await KhamLamSang.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await KhamLamSang.findOne({is_deleted: false, _id: id});
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
      const { id } = req.params;

      const data = await KhamLamSang.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = khamlamsangService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      const data = await KhamLamSang.findOneAndUpdate({ _id: id }, value, { new: true });
      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },

  async updateKhoaKhamBenh(req, res){
    try{

      const { id } = req.params;

      //lấy thông tin của khám lâm sàng.
      let khamlamsang = await KhamLamSang.findById(id).lean()
      if(!khamlamsang){
        return  responseAction.error(res, 404, '')
      }
      let url = req.url
      let arrayUrl =  url.split('/')
      let chuyenkhoa = arrayUrl[2]
      let bacsy = chuyenkhoa + '_bac_sy_id';
      let benh = chuyenkhoa + '_benh_id';
      let bacsy_id = khamlamsang[bacsy]
      let benh_id = khamlamsang[benh] ? khamlamsang[benh] : []

      if(req.user.role === 'BAC_SY' && bacsy_id && bacsy_id.toString() !== req.user._id.toString()){
        return res.status(400).json({success: false, message: 'Bạn không có quyền cập nhật dữ liệu người khác.'})
      }

      // danh sách bệnh ID:
      let nhombenh_id = []
      if(benh_id.length){
        let dsBenh = await Benh.find({_id: {$in: benh_id}})
        dsBenh.forEach(curr => {
          if(curr.nhombenh_id) nhombenh_id.push(curr.nhombenh_id)
        })
      }
      
      let value = req.body
      const data = await KhamLamSang.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({path: 'khamsuckhoe_id', select: 'trangthai'})
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

      uptTrangThaiKSK(data.khamsuckhoe_id, nhombenh_id)
      let dataRtn = thongTinKhoaKhamBenh(data, chuyenkhoa)

      return res.json(dataRtn)
    }
    catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  }
};
