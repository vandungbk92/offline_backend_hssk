import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const xeploaisuckhoeSchema = new Schema({
  xeploai: {
    type: String,
    required: true
  },
  mamau: {
    type: String
  },
  ghichu: {
    type: String
  },
  thutu: {
    type: String
  },
  is_default: {type: Boolean, default: false},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
xeploaisuckhoeSchema.plugin(mongoosePaginate);
export default mongoose.model('XepLoaiSucKhoe', xeploaisuckhoeSchema);
