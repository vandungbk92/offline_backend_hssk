import Joi from 'joi';

export default {
  validateBody(body, method) {
    let objSchema = {
      makcb: Joi.string().required().label('Mã khám chữa bệnh').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      mabenhvien: Joi.string().required().label('Mã bệnh viện').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      thebhyt: Joi.string().required().label('Số thẻ BHYT').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      hoten: Joi.string().required().label('Tên bệnh nhân').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
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
};
