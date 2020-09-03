import Joi from 'joi';
import bcrypt from 'bcryptjs';

export default {
  encryptPassword(palinText) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(palinText, salt);
  },
  comparePassword(plainText, encrypedPassword) {
    return bcrypt.compareSync(plainText, encrypedPassword);
  },
  validateBody(body, method) {

    let objSchema = {
      hoten: Joi.string().required().label('Họ tên').error((errors) => {
        return {
          template: 'không được bỏ trống',
          context: {
            errors: errors.length,
            codes: errors.map((err) => err.type)
          }
        };
      }),
    }

    let newSchema = {}
    if(method === 'POST'){
      newSchema = Object.assign({}, objSchema)
    }else{
      for (let key in objSchema) {
        if (objSchema.hasOwnProperty(key) && body.hasOwnProperty(key)) {
          newSchema[key] = objSchema[key]
        }
      }
    }

    let schema = Joi.object().keys(newSchema);
    const { value, error } = Joi.validate(body, schema, {allowUnknown: true , abortEarly: true});
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
  validateLogin(body) {
    const schema = Joi.object().keys({
      username: Joi.string().required().label('Tài khoản').error((errors) => {
        return {
          template: 'không được bỏ trống'
        };
      }),
      password: Joi.string().required().label('Mật khẩu').error((errors) => {
        return {
          template: 'không được bỏ trống'
        };
      }),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  },
};
