import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const nhombenhSchema = new Schema({
  machuong: {
    type: String,
    required: true
  },
  tenchuong: {
    type: String,
    required: true
  },
  maicd: {type: String},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
nhombenhSchema.plugin(mongoosePaginate);
export default mongoose.model('ChuongBenh', nhombenhSchema);
