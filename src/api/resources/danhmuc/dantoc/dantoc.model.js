import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const dantocSchema = new Schema({
  dantoc: {
    type: String,
    required: true
  },
  thutu: { type: Number },
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
dantocSchema.plugin(mongoosePaginate);
export default mongoose.model('DanToc', dantocSchema);
