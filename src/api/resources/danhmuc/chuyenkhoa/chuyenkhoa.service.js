import Joi from 'joi';

export default {
  validateBody(body, method) {
    let objSchema = {
      chuyenkhoa: Joi.string().required().label('Tên chuyên khoa').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      phanloai_id: Joi.string().required().label('Phân loại khám').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      })
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
