import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const qhgiadinhSchema = new Schema({
  qhgiadinh: {
    type: String,
    required: true
  },
  thutu: {type: Number},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
qhgiadinhSchema.plugin(mongoosePaginate);
export default mongoose.model('QhGiaDinh', qhgiadinhSchema);
