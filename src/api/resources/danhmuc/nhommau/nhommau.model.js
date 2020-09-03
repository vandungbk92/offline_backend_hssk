import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const nhommauSchema = new Schema({
  nhommau: {
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
nhommauSchema.plugin(mongoosePaginate);
export default mongoose.model('NhomMau', nhommauSchema);
