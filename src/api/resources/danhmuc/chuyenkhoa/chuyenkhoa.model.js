import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const chuyenkhoaSchema = new Schema({
  chuyenkhoa: {
    type: String,
    required: true
  },
  phanloai_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhanLoaiKham',
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
chuyenkhoaSchema.plugin(mongoosePaginate);
export default mongoose.model('ChuyenKhoa', chuyenkhoaSchema);
