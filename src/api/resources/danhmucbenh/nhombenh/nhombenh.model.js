import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const nhombenhSchema = new Schema({
  manhom: {
    type: String
  },
  tennhom: {
    type: String,
    required: true
  },
  ghichu: {
    type: String
  },
  thutu: {type: Number},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
nhombenhSchema.plugin(mongoosePaginate);
export default mongoose.model('NhomBenh', nhombenhSchema);
