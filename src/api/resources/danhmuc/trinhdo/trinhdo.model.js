import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const trinhdoSchema = new Schema({
  tentrinhdo: {
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
trinhdoSchema.plugin(mongoosePaginate);
export default mongoose.model('TrinhDo', trinhdoSchema);
