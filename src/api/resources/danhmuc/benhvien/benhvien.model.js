import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const benhvienSchema = new Schema({
  mabenhvien: {
    type: String,
    required: true
  },
  tenbenhvien: {
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
benhvienSchema.plugin(mongoosePaginate);
export default mongoose.model('BenhVien', benhvienSchema);
