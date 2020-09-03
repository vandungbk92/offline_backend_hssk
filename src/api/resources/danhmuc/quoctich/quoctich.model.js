import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const quoctichSchema = new Schema({
  quoctich: {
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
quoctichSchema.plugin(mongoosePaginate);
export default mongoose.model('QuocTich', quoctichSchema);
