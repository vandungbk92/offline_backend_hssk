import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const nhombenhSchema = new Schema({
  magom: {
    type: String,
    required: true
  },
  tengom: {
    type: String,
    required: true
  },
  chuongbenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ChuongBenh'},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
nhombenhSchema.plugin(mongoosePaginate);
export default mongoose.model('GomBenh', nhombenhSchema);
