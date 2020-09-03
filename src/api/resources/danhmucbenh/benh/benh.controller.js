import benhService from './benh.service';
import Benh from './benh.model';
import * as responseAction from '../../../utils/responseAction';
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import GomBenh from "../gombenh/gombenh.model";

export default {
  async create(req, res) {
    try {
      const { value, error } = benhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await Benh.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },

  async upload(req, res) {
    try {
      let dsbenh = req.body
      if(!dsbenh.length){
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu tải lên trống.'
        })
      }

      let dataCheckFail = false;
      let txtError = 0
      let listMaBenh = [];

      for(let i=0; i<dsbenh.length; i++){
        let data = dsbenh[i];
        if(!data.chuongbenh_id || !data.gombenh_id || !data.mabenh || !data.tenbenh){
          dataCheckFail = true;
          let index = i + 1;
          txtError = 'Dữ liệu dòng ' + index + ' không đúng, mã chương bệnh, mã gom, mã bệnh, tên bệnh là bắt buộc.';
          break;
        }
        listMaBenh = [...listMaBenh, data.mabenh];
      }

      if(dataCheckFail){
        return res.status(400).json({
          success: false,
          message: txtError
        })
      }

      // tìm kiếm mã gom đã tồn tại chưa.
      let dataCheckExist = await Benh.findOne({magom: {$in: listMaBenh}})
      if(dataCheckExist){
        return res.status(400).json({
          success: false,
          message: 'Mã bệnh ' + dataCheckExist.mabenh + ' đã tồn tại'
        })
      }

      const data = await Benh.create(dsbenh);
      let opts = [{path: 'chuongbenh_id', select: 'machuong tenchuong'}, {path: 'gombenh_id', select: 'magom tengom'}];
      let dataRtn = await Benh.populate(data, opts);
      return res.json(dataRtn);
    } catch (err) {
      console.log(err, 'errerrerr')
      return responseAction.error(res, 500, err.errors)
    }
  },

  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {tennhom: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      options.populate=[
        {path:'chuongbenh_id', select: 'machuong tenchuong'},
        {path:'xeploai_id'},
        {path: 'gombenh_id', select: 'magom tengom'},
        {path: 'nhombenh_id', select: 'tennhom manhom'},
      ]
      const data = await Benh.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await Benh.findOne({is_deleted: false, _id: id}).populate({path:'chuongbenh_id', select: 'machuong tenchuong'})
        .populate({path:'gombenh_id', select: 'magom tengom'})
        .populate({path:'xeploai_id', select: 'xeploai'})
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

      const data = await Benh.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = benhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      const data = await Benh.findOneAndUpdate({ _id: id }, value, { new: true })
        .populate({path:'nhombenh_id'})
        .populate({path:'chuongbenh_id', select: 'machuong tenchuong'})
        .populate({path:'gombenh_id', select: 'magom tengom'})
        .populate({path:'xeploai_id', select: 'xeploai'})
      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },
};
