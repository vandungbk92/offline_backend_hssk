import Faqs from './faqs.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest'

export default {
  async create(req, res) {
    let body = req.body
    body.created_by = req.user._id
    try {
      const faq = await Faqs.create(body);
      return res.json(faq);
    } catch (err) {
      return  responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      let options = optionsRequest(req.query)
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false
      }

      const faqs = await Faqs.paginate(query, options)
      return res.json(faqs);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const faqs = await Faqs.findById(id);
      if (!faqs) {
        return  responseAction.error(res, 404, '')
      }
      return res.json(faqs);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const faqs = await Faqs.findOneAndRemove({ _id: id });
      if (!faqs) {
        return responseAction.error(res, 404, '')
      }
      return res.json(faqs);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;

      let body = req.body
      body.updated_by = req.user._id

      const faqs = await Faqs.findOneAndUpdate({ _id: id }, body, { new: true });
      if (!faqs) {
        return responseAction.error(res, 404, '')
      }
      return res.json(faqs);
    } catch (err) {
      return responseAction.error(res, 500, err.errors);
    }
  },
};
