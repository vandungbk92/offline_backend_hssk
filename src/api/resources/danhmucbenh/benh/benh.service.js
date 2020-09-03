import Joi from 'joi';

export default {
  validateBody(body, method) {
    let objSchema = {
      mabenh: Joi.string().required().label('Mã bệnh').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      tenbenh: Joi.string().required().label('Tên bệnh').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      nhombenh_id: Joi.string().label('Nhóm bệnh').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }).allow(null, ""),
      xeploai_id: Joi.string().label('Xếp loại').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }).allow(null, "")
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
};
