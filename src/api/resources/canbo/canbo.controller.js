import canboService from './canbo.service';
import CanBo from './canbo.model';
import KhamSucKhoe from '../khambenh/khamsuckhoe/khamsuckhoe.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest';
import {dateFormatter, dateFormatterFromDate} from "../../utils/convertDateTime";

export default {
  async   create(req, res) {
    try {
      const { value, error } = canboService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra thẻ bảo hiểm y tế đã tồn tại chưa
      let hoten = value.hoten
      let ho = hoten.split(' ').slice(0, -1).join(' ');
      let ten = hoten.split(' ').slice(-1).join(' ');
      value.ho = ho ? ho.trim() : ''
      value.ten = ten ? ten.trim() : ''

      let dataCheck = await CanBo.findOne({is_deleted: false, thebhyt: value.thebhyt})
      if(dataCheck){
        return res.status(400).json({success: false, message: 'Số thẻ BHYT đã tồn tại, vui lòng kiểm tra và thử lại.'})
      }

      const data = await CanBo.create(value);
      return res.json(data);
    } catch (err) {
      console.log(err)
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      if(query.dotkhambenh_id && query.dotkhambenh_id['$nin']){
        // lấy danh sách các cán bộ, đã khám bệnh.
        let dsIdCanBo = await KhamSucKhoe.find({is_deleted: false, dotkhambenh_id: query.dotkhambenh_id['$nin']}).lean().distinct('canbo_id');
        delete query.dotkhambenh_id
        query._id = {$nin: dsIdCanBo}
      }
      let options = optionsRequest(req.query)
      options.sort = {ten: 'asc'}
      options.populate = [
        {path: 'dantoc_id', select: 'dantoc'},
        {path: 'quoctich_id', select: 'quoctich_id'},
        {path: 'tongiao_id', select: 'tongiao'},
        {path: 'nhommau_id', select: 'nhommau'},
        {path: 'herh_id', select: 'herh'},
        {path: 'hktt_tinh_id', select: 'tentinh'},
        {path: 'hktt_qh_id', select: 'tenqh'},
        {path: 'hktt_px_id', select: 'tenphuongxa'},
        {path: 'khaisinh_tinh_id', select: 'tentinh'},
        {path: 'tinhthanh_id', select: 'tentinh'},
        {path: 'quanhuyen_id', select: 'tenqh'},
        {path: 'phuongxa_id', select: 'tenphuongxa'}
      ]
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      console.log(options)
      const data = await CanBo.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await CanBo.findOne({is_deleted: false, _id: id})
        .populate({path: 'dantoc_id', select: 'dantoc'})
        .populate({path: 'quoctich_id', select: 'quoctich_id'})
        .populate({path: 'tongiao_id', select: 'tongiao'})
        .populate({path: 'nhommau_id', select: 'nhommau'})
        .populate({path: 'herh_id', select: 'herh'})
        .populate({path: 'hktt_tinh_id', select: 'tentinh'})
        .populate({path: 'hktt_qh_id', select: 'tenqh'})
        .populate({path: 'hktt_px_id', select: 'tenphuongxa'})
        .populate({path: 'khaisinh_tinh_id', select: 'tentinh'})
        .populate({path: 'tinhthanh_id', select: 'tentinh'})
        .populate({path: 'quanhuyen_id', select: 'tenqh'})
        .populate({path: 'phuongxa_id', select: 'tenphuongxa'})
      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOnePrint(req, res) {
    const { id } = req.params;
    const data = await CanBo.findOne({is_deleted: false, _id: id})
      .populate({path: 'dantoc_id', select: 'dantoc'})
      .populate({path: 'quoctich_id', select: 'quoctich_id'})
      .populate({path: 'tongiao_id', select: 'tongiao'})
      .populate({path: 'nhommau_id', select: 'nhommau'})
      .populate({path: 'herh_id', select: 'herh'})
      .populate({path: 'hktt_tinh_id', select: 'tentinh'})
      .populate({path: 'hktt_qh_id', select: 'tenqh'})
      .populate({path: 'hktt_px_id', select: 'tenphuongxa'})
      .populate({path: 'khaisinh_tinh_id', select: 'tentinh'})
      .populate({path: 'tinhthanh_id', select: 'tentinh'})
      .populate({path: 'quanhuyen_id', select: 'tenqh'})
      .populate({path: 'phuongxa_id', select: 'tenphuongxa'}).lean();
    if (!data) {
      return responseAction.error(res, 404, '')
    }
    data.dantoc = data.dantoc_id ? data.dantoc_id.dantoc : '';
    data.nhommau = data.nhommau_id ? data.nhommau_id.nhommau : '';
    data.ngaysinh = data.ngaysinh ? dateFormatter(data.ngaysinh) : ''
    data.tinhkhaisinh = data.khaisinh_tinh_id ? data.khaisinh_tinh_id.tentinh : '';

    data.hktt_phuongxa = data.hktt_px_id ? data.hktt_px_id.tenphuongxa : ''
    data.hktt_quanhuyen = data.hktt_qh_id ? data.hktt_qh_id.tenqh : ''
    data.hktt_tinhthanh = data.hktt_tinh_id ? data.hktt_tinh_id.tentinh : ''

    data.phuongxa = data.phuongxa_id ? data.phuongxa_id.tenphuongxa : ''
    data.quanhuyen = data.quanhuyen_id ? data.quanhuyen_id.tenqh : ''
    data.tinhthanh = data.tinhthanh_id ? data.tinhthanh_id.tentinh : ''




    return res.json(data);

  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const data = await CanBo.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = canboService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      if(value.hoten){
        let hoten = value.hoten
        let ho = hoten.split(' ').slice(0, -1).join(' ');
        let ten = hoten.split(' ').slice(-1).join(' ');
        value.ho = ho ? ho.trim() : '';
        value.ten = ten ? ten.trim() : '';
      }

      if(value.thebhyt){
        let dataCheck = await CanBo.findOne({is_deleted: false, thebhyt: value.thebhyt, _id: {$ne: id}})
        if(dataCheck){
          return res.status(400).json({success: false, message: 'Số thẻ BHYT đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      const data = await CanBo.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({path: 'dantoc_id', select: 'dantoc'})
        .populate({path: 'quoctich_id', select: 'quoctich_id'})
        .populate({path: 'tongiao_id', select: 'tongiao'})
        .populate({path: 'nhommau_id', select: 'nhommau'})
        .populate({path: 'herh_id', select: 'herh'})
        .populate({path: 'hktt_tinh_id', select: 'tentinh'})
        .populate({path: 'hktt_qh_id', select: 'tenqh'})
        .populate({path: 'hktt_px_id', select: 'tenphuongxa'})
        .populate({path: 'khaisinh_tinh_id', select: 'tentinh'})
        .populate({path: 'tinhthanh_id', select: 'tentinh'})
        .populate({path: 'quanhuyen_id', select: 'tenqh'})
        .populate({path: 'phuongxa_id', select: 'tenphuongxa'})
      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },

  async dsCanBoKhamBenh(req, res) {
    try {
      let query = filterRequest(req.query, true)

      if(query.dotkhambenh_id && query.dotkhambenh_id['$nin']){
        // lấy danh sách các cán bộ, đã khám bệnh.
        let dsIdCanBo = await KhamSucKhoe.find({is_deleted: false, dotkhambenh_id: query.dotkhambenh_id}).lean().distinct('canbo_id');
        delete query.dotkhambenh_id
        query._id = {$nin: dsIdCanBo}
      }
      let options = optionsRequest(req.query)
      options.sort = {ten: 1}
      options.populate = [
        {path: 'dantoc_id', select: 'dantoc'},
        {path: 'quoctich_id', select: 'quoctich_id'},
        {path: 'tongiao_id', select: 'tongiao'},
        {path: 'nhommau_id', select: 'nhommau'},
        {path: 'herh_id', select: 'herh'},
        {path: 'hktt_tinh_id', select: 'tentinh'},
        {path: 'hktt_qh_id', select: 'tenqh'},
        {path: 'hktt_px_id', select: 'tenphuongxa'},
        {path: 'khaisinh_tinh_id', select: 'tentinh'},
        {path: 'tinhthanh_id', select: 'tentinh'},
        {path: 'quanhuyen_id', select: 'tenqh'},
        {path: 'phuongxa_id', select: 'tenphuongxa'}
      ]
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      return res.json(query)
      const data = await CanBo.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async funcLichSuKhamBenh(req, res) {
    try {
      const { id } = req.params;
      const data = await KhamSucKhoe.find({is_deleted: false, canbo_id: id})
        .populate({path: 'xeploai_id', select: 'xeploai'})
        .populate({path: 'nhombenh_id', select: 'tennhom'})
        .populate({path: 'dotkhambenh_id', select: 'dotkhambenh ngaybatdau ngayketthuc'}).sort({created_at: -1})
        .populate({path: 'khamchuabenh_id', select: 'tenbenhvien makcb thebhyt'}).sort({created_at: -1})
        .populate({path: 'canbo_id', select: 'hoten ngaysinh thebhyt'}).sort({created_at: -1})
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
