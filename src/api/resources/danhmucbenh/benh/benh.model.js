import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const benhSchema = new Schema({
  mabenh: {type: String, required: true},
  tenbenh: {type: String, required: true},
  mantinh: {type: Boolean, default: false},
  benhthuonggap: {type: Boolean, default: false},
  benhnam: {type: Boolean, default: false},
  ngoaidinhsuat: {type: Boolean, default: false},
  cantheodoi: {type: Boolean, default: false},
  nhombenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'NhomBenh'},
  chuongbenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ChuongBenh'},
  gombenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'GomBenh'},
  xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
  benhgioitinh: {type: String, default: 'ALL'},
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
benhSchema.plugin(mongoosePaginate);
export default mongoose.model('Benh', benhSchema);
