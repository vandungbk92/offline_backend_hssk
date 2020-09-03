import quoctichService from './quoctich.service';
import QuocTich from './quoctich.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = quoctichService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra quoctich đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      let dataCheck = await QuocTich.findOne({is_deleted: false, quoctich: value.quoctich});
      if(dataCheck){
        return res.status(400).json({success: false, message: 'Quốc tịch đã tồn tại, vui lòng kiểm tra và thử lại.'})
      }

      const data = await QuocTich.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {thutu: 1, quoctich: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await QuocTich.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await QuocTich.findOne({is_deleted: false, _id: id});
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

      const data = await QuocTich.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = quoctichService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      if(value.quoctich){
        let dataCheck = await QuocTich.findOne({is_deleted: false, quoctich: value.quoctich, _id: {$ne: id}});
        if(dataCheck){
          return res.status(400).json({success: false, message: 'Quốc tịch đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      const data = await QuocTich.findOneAndUpdate({ _id: id }, value, { new: true });
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
