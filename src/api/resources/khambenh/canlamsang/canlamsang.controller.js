import canlamsangService from './canlamsang.service';
import CanLamSang from './canlamsang.model';
import KhamSucKhoe from '../khamsuckhoe/khamsuckhoe.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';
import {uptTrangThaiKSK} from "../khamsuckhoe/khamsuckhoe.untils";

export default {
  async create(req, res) {
    try {
      const { value, error } = canlamsangService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await CanLamSang.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true);
      let options = optionsRequest(req.query)
      options.sort = {canlamsang: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await CanLamSang.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await CanLamSang.findOne({is_deleted: false, _id: id});
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

      const data = await CanLamSang.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = canlamsangService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      let dataExist = await CanLamSang.findById(id).populate({path: 'khamsuckhoe_id', select: 'tuoi'}).lean()
      if(!dataExist){
        return  responseAction.error(res, 404, '')
      }
      if(value.tuoi && dataExist.khamsuckhoe_id && dataExist.khamsuckhoe_id.tuoi && value.tuoi !== dataExist.khamsuckhoe_id.tuoi){
        await KhamSucKhoe.findByIdAndUpdate(dataExist.khamsuckhoe_id._id, {tuoi: value.tuoi}, {new: true})
      }
      const data = await CanLamSang.findOneAndUpdate({ _id: id }, value, { new: true }).populate({path: 'khamsuckhoe_id', select: 'trangthai'});
      if (!data) {
        return  responseAction.error(res, 404, '')
      }
      uptTrangThaiKSK(data.khamsuckhoe_id)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },
};
