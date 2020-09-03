import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const capbacSchema = new Schema({
  capbac: {
    type: String,
    required: true
  },
  code: {
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
capbacSchema.plugin(mongoosePaginate);
export default mongoose.model('CapBac', capbacSchema);
