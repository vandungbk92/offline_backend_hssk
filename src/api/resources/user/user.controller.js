import userService from './user.service';
import User from './user.model';
import jwt from '../../helpers/jwt';
import * as responseAction from '../../utils/responseAction';
import {sendEmail} from '../../utils/mailHelper';
import {filterRequest, optionsRequest} from '../../utils/filterRequest'

import { getConfig } from '../../../config/config';
const config = getConfig(process.env.NODE_ENV);

export default {
  async signup(req, res) {
    try {
      const { value, error } = userService.validateSignup(req.body, 'POST');
      if (error) {
        return res.status(400).json(error.details);
      }

      let userInfo = await User.findOne({$or: [
        {email: value.email},
        {code: value.code},
        {username: value.username}
      ]})
      if (userInfo) {
        if (value.username == userInfo.username) {
          return res.status(400).json({success: false, message: 'Tài khoản đã được đăng ký'})
        }
        if (value.code == userInfo.code) {
          return res.status(400).json({success: false, message: 'Mã nhân viên đã được đăng ký'})
        }
        if (value.email == userInfo.email) {
          return res.status(400).json({success: false, message: 'Email đã được đăng ký'})
        }
      }
      const encryptedPass = userService.encryptPassword(value.password);

      value.password = encryptedPass
      const user = await User.create(value);

      if(value.email){
        let mailOptions = {
          from: `Quản lý chung cư <${config.mail.auth.user}>`, // sender address
          to: value.email, // list of receivers
          subject: 'Đăng ký tài khoản thành công', // Subject line
          //text: 'Pass moi la 123455', // plaintext body
          html: `<h2>Bạn đã được tạo thành công tài khoản tại hệ thống quản lý chung cư, Thông tin tài khoản</h2>
              <div><strong>Họ tên: </strong>${value.full_name}</div>
              <div><strong>Tên tài khoản: </strong>${value.username}</div>    
              <div><strong>Số điện thoại: </strong>${value.phone}</div>
              <div><strong>Email: </strong>${value.email}</div>
              <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`, // html body
        };

        sendEmail(mailOptions, (err) => {
          if (err) {
            responseAction.error(res, 400);
            return;
          } else {

          }
        });
      }
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async login(req, res) {
    try {
      const { value, error } = userService.validateLogin(req.body);
      if (error) {
        return res.status(400).json(error);
      }

      // Đầu tiên kiểm tra xem có phải tài khoản của giáo viên không.
      const user = await User.findOne({ username: value.username, is_deleted: false });

      // nếu giáo viên tồn tại và đúng mật khẩu thì trả về.
      if (user) {
        const authenticted = userService.comparePassword(value.password, user.password);

        if(authenticted){
          const token = jwt.issue({ id: user._id, isUser: true }, '10d');
          return res.json({ token });
        }
        // return res.status(401).json({ success: false, message: 'Tài khoản hoặc mật khẩu không đúng' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  authenticate(req, res) {
    return res.status(200).json(req.user);
  },

  async findAll(req, res) {
    try {
      let query = filterRequest(req.query, true)
      let options = optionsRequest(req.query);
      if(req.query.limit && req.query.limit === '0'){
        options.pagination = false;
      }
      options.select = '-password -is_deleted'
      const users = await User.paginate(query, options);
      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },


  async findOne(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
        .populate({path: 'bomon_id', select: 'tenbomon mabomon'})
      if (!user) {
        responseAction.error(res, 404, '')
      }
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOneAndUpdate({ _id: id }, {is_deleted: true}, { new: true });
      if (!user) {
        responseAction.error(res, 404, '')
      }

      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async update(req, res) {
    try {
      const { id } = req.params;
      const { value, error } = userService.validateSignup(req.body, 'PUT');
      if (error && error.details) {
        responseAction.error(res, 400, error.details[0])
      }

      let userInfo = await User.findOne({$and: [
        {_id: {$ne: id}},
        {$or: [
          {email: value.email},
          {username: value.username}
        ]}
      ]})
      if (userInfo) {
        if (value.username === userInfo.username) {
          return res.status(400).json({success: false, message: 'Tài khoản đã được đăng ký'})
        }
        if (value.email === userInfo.email) {
          return res.status(400).json({success: false, message: 'Email đã được đăng ký'})
        }
      }

      const user = await User.findOneAndUpdate({ _id: id }, value, { new: true }).populate({path: 'bomon_id', select: 'tenbomon mabomon'});
      if (!user) {
        responseAction.error(res, 404, '')
      }

      if(user.email){
        let mailOptions = {
          from: `Quản lý chung cư <${config.mail.auth.user}>`, // sender address
          to: value.email, // list of receivers
          subject: 'Cập nhật thông tin tài khoản thành công', // Subject line
          //text: 'Pass moi la 123455', // plaintext body
          html: `<h2>Bạn đã được cập nhật tài khoản tại hệ thống quản lý chung cư, Thông tin tài khoản</h2>
              <div><strong>Họ tên: </strong>${user.full_name}</div>
              <div><strong>Tên tài khoản: </strong>${user.username}</div>             
              <div><strong>Số điện thoại: </strong>${user.phone}</div>
              <div><strong>Email: </strong>${user.email}</div>
               <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`, // html body
        };
        // console.log(mailOptions, 'mailOptions')
        sendEmail(mailOptions, (err) => {
          if (err) {
            responseAction.error(res, 400);
            return;
          } else {

          }
        });
      }

      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async changePassword(req, res) {
    const user = await User.findOne({ is_deleted: false, _id: req.user._id })
    if (!user) {
      responseAction.error(res, 404, '')
    }

    const authenticted = userService.comparePassword(req.body.old_password, user.password);
    if (!authenticted) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    const encryptedPass = userService.encryptPassword(req.body.new_password);

    const userUpdate = await User.findOneAndUpdate({ _id: req.user._id }, {password: encryptedPass}, { new: true });

    let mailOptions = {
      from: `Quản lý chung cư <${config.mail.auth.user}>`, // sender address
      to: userUpdate.email, // list of receivers
      subject: 'Đổi mật khẩu thành công', // Subject line
      //text: 'Pass moi la 123455', // plaintext body
      html: `<h2>Mật khẩu mới của bạn là <b style="color: red">${req.body.new_password}</b></h2>
              </br>
              <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>` // html body
    };

    sendEmail(mailOptions, (err) => {
      if (err) {
        responseAction.error(res, 400)
      } else {

      }
    });
    return res.json(userUpdate);
  },

  async updateInfo(req, res) {
    try {
      const id = req.user._id;
      const { value, error } = userService.validateSignup(req.body, 'PUT');

      if (error && error.details) {
        responseAction.error(res, 400, error.details[0])
        return
      }
      const user = await User.findOneAndUpdate({ _id: id }, value, { new: true })
      if (!user) {
        responseAction.error(res, 404, '')
      }

      if(user.email){
        let mailOptions = {
          from: `Hệ thống quản lý chung cư <${config.mail.auth.user}>`, // sender address
          to: value.email, // list of receivers
          subject: 'Cập nhật thông tin tài khoản thành công', // Subject line
          //text: 'Pass moi la 123455', // plaintext body
          html: `<h2>Bạn đã cập nhật tài khoản thành công, Thông tin tài khoản</h2>
              <div><strong>Họ tên: </strong>${user.full_name}</div>
              <div><strong>Tên tài khoản: </strong>${user.username}</div>             
              <div><strong>Số điện thoại: </strong>${user.phone}</div>
              <div><strong>Email: </strong>${user.email}</div>
               <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>`, // html body
        };

        sendEmail(mailOptions, (err) => {
          if (err) {
            responseAction.error(res, 400);
            return;
          } else {

          }
        });
      }
      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async forgotPasswordMail(req, res) {
    try {
      let user = await User.findOne({is_deleted: false, email: req.body.email})

      if (!user) {
        responseAction.error(res, 404, '')
      }

      const token = jwt.issue({ id: user._id }, '5m');

      let url = config.host_admin + '/forgot-password?token=' + token
      let mailOptions = {
        from: `ThinkLabs Support <${config.mail.auth.user}>`, // sender address
        to: user.email, // list of receivers
        subject: 'Quên mật khẩu', // Subject line
        html: `<p>Bạn có yêu cầu thay đổi mật khẩu trên hệ thống phản hồi công dân</p>
              </br>
              <p>Vui lòng click vào link để thay đổi mật khẩu : ${url} </p>` // html body
      };


      sendEmail(mailOptions, (err) => {
        if (err) {
          responseAction.error(res, 400)
        } else {

        }
      });
      return res.json({success: true})
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },

  async resetPassword(req, res) {
    const user = await User.findOne({ is_deleted: false, _id: req.user._id })
    if (!user) {
      responseAction.error(res, 404, '')
    }

    const encryptedPass = userService.encryptPassword(req.body.password);

    const userUpdate = await User.findOneAndUpdate({ _id: req.user._id }, {password: encryptedPass}, { new: true });

    let mailOptions = {
      from: `Hệ thống quản lý chung cư <${config.mail.auth.user}>`, // sender address
      to: userUpdate.email, // list of receivers
      subject: 'Đổi mật khẩu thành công', // Subject line
      //text: 'Pass moi la 123455', // plaintext body
      html: `<h2>Mật khẩu mới của bạn là <b style="color: red">${req.body.password}</b></h2>
              </br>
              <div>Vui lòng đăng nhập tại <a href="${config.host_admin}">Link</a></div>` // html body
    };

    sendEmail(mailOptions, (err) => {
      if (err) {
        responseAction.error(res, 400)
      } else {

      }
    });
    return res.json({success: true});
  },
};
