import canbonganhService from './canbonganh.service';
import CanBoNganh from './canbonganh.model';
import CapBac from '../danhmucnganh/capbac/capbac.model';
import CanBo from '../canbo/canbo.model';
import * as responseAction from '../../utils/responseAction'
import {filterRequest, optionsRequest} from '../../utils/filterRequest';
import * as XLSX from "xlsx";

export default {

  async create(req, res) {
    try {
      const {value, error} = canbonganhService.validateBody(req.body, 'POST');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      let hoten = value.hoten;
      value.ho = hoten.split(' ').slice(0, -1).join(' ');
      value.ten = hoten.split(' ').slice(-1).join(' ');

      const data = await CanBoNganh.create(value);
      return res.json(data);
    } catch (err) {
      return responseAction.error(res, 500, err.errors)
    }
  },
  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true);

      let options = optionsRequest(req.query);
      options.sort = {canbonganh: 1};
      if (req.query.limit && req.query.limit === '0') {
        options.pagination = false;
      }
      options.populate = [
        {path: 'capbac_id'},
        {path: 'chucvu_id'},
        {path: 'donvi_id'},
        {path: 'lucluong_id'},
        {path: 'canbo_id', select: 'hoten thebhyt'},
      ];
      const data = await CanBoNganh.paginate(query, options);
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async findOne(req, res) {
    try {
      const {id} = req.params;
      const data = await CanBoNganh.findOne({is_deleted: false, _id: id})
        .populate({path: 'canbo_id', select: ''});
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
      const {id} = req.params;

      const data = await CanBoNganh.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});

      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const {id} = req.params;
      const {value, error} = canbonganhService.validateBody(req.body, 'PUT');
      if (error && error.details) {
        return responseAction.error(res, 400, error.details[0])
      }
      if (value.hoten) {
        let hoten = value.hoten;
        value.ho = hoten.split(' ').slice(0, -1).join(' ');
        value.ten = hoten.split(' ').slice(-1).join(' ');
      }
      const data = await CanBoNganh.findOneAndUpdate({_id: id}, value, {new: true});
      if (!data) {
        return responseAction.error(res, 404, '')
      }
      return res.json(data);
    } catch (err) {
      console.error(err);
      return responseAction.error(res, 500, err.errors)
    }
  },
  import: async function (req, res) {

    function getCapBacCode(CAPBAC) {
      function xoa_dau(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
      }

      return xoa_dau(CAPBAC).trim().replace(/[^\w]/gi, '').toUpperCase();
    }

    try {
      let filePath = req.files.importFile.path;
      const transformFile = (filePath) => {
        return new Promise((resolve => {
          var rowObj = [];
          let sheetData = [];
          var wb = XLSX.readFile(filePath);
          wb.SheetNames.forEach(function (sheetName) {
            let sheet = {
              name: sheetName,
            };
            rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
            sheet.rows = rowObj;
            sheetData.push(sheet)
          });
          resolve(sheetData)
        }))
      };
      let dataInFile = await transformFile(filePath);
      let data = [];
      let objBhyt = {};
      dataInFile.forEach(sheet => {
        sheet.rows.forEach(row => {
          row.CAPBAC_CODE = getCapBacCode(row.CAPBAC);
          if (!objBhyt[row.MA_SO_BHYT]) {
            data = [...data, row];
            objBhyt[row.MA_SO_BHYT] = row.MA_SO_BHYT
          }
        })
      });
      let allTheBhyt = data.map(canbo => canbo.thebhyt);
      let allCanbo = await CanBo.find({is_deleted: false, thebhyt: {$nin: allTheBhyt}});
      let mapCanbo = {};
      allCanbo.forEach(canbo => {
        mapCanbo[canbo.thebhyt] = canbo
      });

      let allCanbonganh = await CanBoNganh.find({is_deleted: false, thebhyt: {$nin: allTheBhyt}});
      let mapCanbonganh = {};
      allCanbonganh.forEach(canbonganh => {
        mapCanbonganh[canbonganh.thebhyt] = canbonganh
      });

      let listCapbac = await CapBac.find({is_deleted: false}).lean();
      let mapCapbac = {};
      listCapbac.forEach(capbac => {
        mapCapbac[capbac.code] = capbac
      });

      const getOrCreateCapbacCanbo = async (canbonganhData) => {
        let capbac = mapCapbac[canbonganhData.CAPBAC_CODE];
        if (capbac) return capbac;

        async function createCapbac(canbonganhData) {
          return await CapBac.create({
            capbac: canbonganhData.CAPBAC,
            code: canbonganhData.CAPBAC_CODE
          })
        }

        capbac = await createCapbac(canbonganhData);
        mapCapbac[capbac.code] = capbac;
        return capbac;
      };

      const createCanboData = async (canbonganhData) => {
        let canbonganh = mapCanbonganh[canbonganhData.MA_SO_BHYT];
        if (canbonganh) {
          return canbonganh
        }

        async function getOrCreateCanbo(canbonganhData) {

          let canbo = mapCanbo[canbonganhData.MA_SO_BHYT];
          if (canbo) {
            return canbo
          }

          async function createCanbo(canbonganhData) {
            return await CanBo.create({
              hoten: canbonganhData.HO_TEN,
              gioitinh: canbonganhData.GIOITINH,
              ngaysinh: canbonganhData.NGAYSINH,
              thebhyt: canbonganhData.MA_SO_BHYT,
              diachi: canbonganhData.DIACHI_CUTRU,
            })
          }

          return await createCanbo(canbonganhData);
        }

        let canbo = await getOrCreateCanbo(canbonganhData);
        let capbac = await getOrCreateCapbacCanbo(canbonganhData);

        return {
          canbo_id: canbo._id,
          ngayvaonganh: undefined,
          thebhyt: canbo.thebhyt,
          sohieu: undefined,
          capbac_id: capbac._id,
          chucvu_id: undefined,
          donvi_id: undefined,
          lucluong_id: undefined,
        }
      };

      const updateCanboNganhPromisse = async (oldCanboNganh, canbo) => {
        let capbac = await getOrCreateCapbacCanbo(canbo);
        oldCanboNganh.capbac_id = capbac._id;
        return oldCanboNganh.save();
      };

      let chunk = [];
      let batchSize = 1000;
      for (let i = 0; i < data.length; i += batchSize) {
        let batchData = data.slice(i, i + batchSize);
        chunk = [...chunk, batchData]
      }
      for (let i = 0; i < chunk.length; i++) {

        let createDatas = [];
        let updateDatas = [];

        chunk[i].forEach(canbo => {
          if (mapCanbonganh[canbo.MA_SO_BHYT]) {
            updateDatas = [...updateDatas, canbo]
          } else {
            createDatas = [...createDatas, canbo]
          }
        });
        let createCanboDatas = [];
        for (let i = 0; i < createDatas.length; i++) {
          createCanboDatas = [...createCanboDatas, await createCanboData(createDatas[i])]
        }
        await CanBoNganh.create(createCanboDatas);

        let updatePromisses = []
        for (let i = 0; i < updateDatas.length; i++) {
          let oldCanboNganh = mapCanbonganh[updateDatas[i].MA_SO_BHYT];
          updatePromisses = [...updatePromisses, updateCanboNganhPromisse(oldCanboNganh, updateDatas[i])]
        }
        await Promise.all(updatePromisses);
        console.log("Chunk:", i, '/', chunk.length)
      }
      return res.json({success: true, message: `Import success:${data.length}`});
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }
};
