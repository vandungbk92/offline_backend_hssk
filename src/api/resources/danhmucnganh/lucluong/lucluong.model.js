import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const lucluongSchema = new Schema({
  lucluong: {
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
lucluongSchema.plugin(mongoosePaginate);
export default mongoose.model('LucLuong', lucluongSchema);
