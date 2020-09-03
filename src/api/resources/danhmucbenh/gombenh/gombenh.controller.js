import gombenhService from './gombenh.service';
import GomBenh from './gombenh.model';
import * as responseAction from '../../../utils/responseAction';
import {filterRequest, optionsRequest} from '../../../utils/filterRequest';

export default {
  async create(req, res) {
    try {
      const { value, error } = gombenhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      const data = await GomBenh.create(value);
      let dataRtn = await data.populate({path: 'chuongbenh_id', select: 'machuong tenchuong'}).execPopulate();
      return res.json(dataRtn);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async upload(req, res) {
    try {
      let dsgombenh = req.body
      if(!dsgombenh.length){
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu tải lên trống.'
        })
      }

      let dataCheckFail = false;
      let txtError = 0
      let listMaGom = [];

      for(let i=0; i<dsgombenh.length; i++){
        let data = dsgombenh[i];
        if(!data.chuongbenh_id || !data.magom || !data.tengom){
          dataCheckFail = true;
          let index = i + 1;
          txtError = 'Dữ liệu dòng ' + index + ' không đúng, mã chương bệnh, mã gom, tên gom là bắt buộc.';
          break;
        }
        listMaGom = [...listMaGom, data.magom];
      }

      if(dataCheckFail){
        return res.status(400).json({
          success: false,
          message: txtError
        })
      }

      // tìm kiếm mã gom đã tồn tại chưa.
      let dataCheckExist = await GomBenh.findOne({magom: {$in: listMaGom}})
      if(dataCheckExist){
        return res.status(400).json({
          success: false,
          message: 'Mã gom ' + dataCheckExist.magom + ' đã tồn tại'
        })
      }

      const data = await GomBenh.create(dsgombenh);
      let opts = [{path: 'chuongbenh_id', select: 'machuong tenchuong'}];
      let dataRtn = await GomBenh.populate(data, opts)
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
      options.populate = {path: 'chuongbenh_id', select: 'machuong'}
      const data = await GomBenh.paginate(query, options)
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const { id } = req.params;
      const data = await GomBenh.findOne({is_deleted: false, _id: id});
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

      const data = await GomBenh.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });

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
      const { value, error } = gombenhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return  responseAction.error(res, 400, error.details[0])
      }
      const data = await GomBenh.findOneAndUpdate({ _id: id }, value, { new: true });
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
