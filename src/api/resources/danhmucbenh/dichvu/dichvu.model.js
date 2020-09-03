import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const dichvuSchema = new Schema({
  madichvu: {
    type: String,
  },
  tendichvu: {
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
dichvuSchema.plugin(mongoosePaginate);
export default mongoose.model('DichVu', dichvuSchema);
