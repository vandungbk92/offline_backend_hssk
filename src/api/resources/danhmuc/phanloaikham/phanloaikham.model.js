import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const phanloaikhamSchema = new Schema({
  phanloaikham: {
    type: String,
    required: true
  },
  thutu: {
    type: String
  },
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
phanloaikhamSchema.plugin(mongoosePaginate);
export default mongoose.model('PhanLoaiKham', phanloaikhamSchema);
