import phanloaikhamService from './phanloaikham.service';
import PhanLoaiKham from './phanloaikham.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = phanloaikhamService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await PhanLoaiKham.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {phanloaikham: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await PhanLoaiKham.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await PhanLoaiKham.findOne({is_deleted: false, _id: id});
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

      const data = await PhanLoaiKham.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = phanloaikhamService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      const data = await PhanLoaiKham.findOneAndUpdate({ _id: id }, value, { new: true });
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
