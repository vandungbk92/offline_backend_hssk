import Setting from './setting.model';
import * as responseAction from '../../utils/responseAction'
import {SETTING_DEFAULT} from '../../constant/setting'

export default {
  async findOne(req, res) {
    try {
      let setting = await Setting.findOne({});
      if (!setting) {
        setting = await Setting.create(SETTING_DEFAULT);
      }

      return res.status(200).json(setting);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;

      const setting = await Setting.findOneAndUpdate({ _id: id }, req.body, { new: true });
      if (!setting) {
         return responseAction.error(res, 404, '')
      }
      return res.json(setting);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
