import tongiaoService from './tongiao.service';
import TonGiao from './tongiao.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = tongiaoService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      let dataCheck = await TonGiao.findOne({is_deleted: false, tongiao: value.tongiao});
      if(dataCheck){
        return res.status(400).json({success: false, message: 'Tôn giáo đã tồn tại, vui lòng kiểm tra và thử lại.'})
      }

      const data = await TonGiao.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)

      let options = optionsRequest(req.query)
      options.sort = {thutu: 1, tongiao: 1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }

      const data = await TonGiao.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await TonGiao.findOne({is_deleted: false, _id: id});
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

      const data = await TonGiao.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = tongiaoService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }

      // kiểm tra dantoc đã tồn tại chưa, nếu tồn tại thì không cho tạo mới.
      if(value.tongiao){
        let dataCheck = await TonGiao.findOne({is_deleted: false, tongiao: value.tongiao, _id: {$ne: id}});
        if(dataCheck){
          return res.status(400).json({success: false, message: 'Tôn giáo đã tồn tại, vui lòng kiểm tra và thử lại.'})
        }
      }

      const data = await TonGiao.findOneAndUpdate({ _id: id }, value, { new: true });
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
