import Joi from 'joi';

export default {
  validateBody(body, method) {
    let objSchema = {
      tentrinhdo: Joi.string().required().label('Tên trình độ').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      }),
      /*mabomon: Joi.string().required().label('Mã bộ môn').error((errors) => {
        return {
          template: 'là bắt buộc nhập'
        };
      })*/
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
