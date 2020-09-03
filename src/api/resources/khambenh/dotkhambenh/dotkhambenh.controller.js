import dotkhambenhService from './dotkhambenh.service';
import DotKhamBenh from './dotkhambenh.model';
import KhamSucKhoe from '../khamsuckhoe/khamsuckhoe.model';
import CanBo from '../../canbo/canbo.model';
import * as responseAction from '../../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = dotkhambenhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await DotKhamBenh.create(value);

      if(value.canbo_id && Array.isArray(value.canbo_id) && value.canbo_id.length){
        let dsCanBo = value.canbo_id.map(canboId => {
          return {
            canbo_id: canboId,
            dotkhambenh_id: data._id
          }
        })
        await KhamSucKhoe.create(dsCanBo)
      }
      return res.json(data);
    } catch (err) {
      console.log(err, 'errerr')
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      let options = optionsRequest(req.query)
      options.sort = {ngaybatdau: -1, created_at: -1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      const data = await DotKhamBenh.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async dsCanBoKhamBenh(req, res){
    try {
      let {id} = req.params;
      req.query.dotkhambenh_id = id

      let query = filterRequest(req.query, true)
      let options = optionsRequest(req.query)
      if(query.hoten || query.thebhyt || query.cmnd){
        let queryCanBo = {is_deleted: false}
        if(query.hoten) {
          queryCanBo.hoten = query.hoten;
          delete query.hoten
        }
        if(query.thebhyt) {
          queryCanBo.thebhyt = query.thebhyt;
          delete query.thebhyt
        }

        if(query.cmnd) {
          queryCanBo.cmnd = query.cmnd;
          delete query.cmnd
        }

        let dsIdCanBo = await CanBo.find(queryCanBo).lean().distinct('_id')
        if(dsIdCanBo.length){
          query.canbo_id = {$in : dsIdCanBo}
        }else {
          return res.json({"docs":[],"totalDocs":0,"limit":options.limit,"totalPages":1,"page":1,"pagingCounter":1,"hasPrevPage":false,"hasNextPage":false,"prevPage":null,"nextPage":null})
        }
      }

      options.sort = {ngaykham: -1, created_at: -1}
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      options.populate = [
        {path: 'canbo_id', select: 'hoten thebhyt'},
        {path: 'xeploai_id', select: 'xeploai'},
        {path: 'nhombenh_id', select: 'tennhom'}
      ]
      const data = await KhamSucKhoe.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async putCanBoKhamBenh(req, res){
    try {
      let {id} = req.params;
      let {canbo_id} = req.body;

      if(!canbo_id && !Array.isArray(canbo_id) && canbo_id.length){
        return res.status(400).json({success: false, message: `Danh sách cán bộ đăng ký khám là bắt buộc nhập.`})
      }

      // tìm xem đã có cán bộ nào khám bệnh rồi hay chưa.
      let canboInfo = await KhamSucKhoe.findOne({_id: id, is_deleted: false, canbo_id: {$in: canbo_id}}).populate({path: 'canbo_id', select: 'hoten thebhyt'})
      if(canboInfo){
        return res.status(400).json({success: false, message: `Cán bộ ${canboInfo.canbo_id.hoten} (${canboInfo.canbo_id.thebhyt}) đã đăng ký khám, vui lòng kiểm tra và thử lại.`})
      }

      canbo_id = canbo_id.map(data => {
        return {
          canbo_id: data,
          dotkhambenh_id: id
        }
      })

      let khamsuckhoe = await KhamSucKhoe.create(canbo_id)
      return res.json(khamsuckhoe)
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await DotKhamBenh.findOne({is_deleted: false, _id: id});
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

      const data = await DotKhamBenh.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = dotkhambenhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      const data = await DotKhamBenh.findOneAndUpdate({ _id: id }, value, { new: true });
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
