import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const chucvuSchema = new Schema({
  chucvu: {
    type: String,
    required: true
  },
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
chucvuSchema.plugin(mongoosePaginate);
export default mongoose.model('ChucVu', chucvuSchema);
