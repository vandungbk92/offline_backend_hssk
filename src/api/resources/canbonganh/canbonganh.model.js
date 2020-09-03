import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const canbonganhSchema = new Schema({
    canbo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CanBo'},
    ngayvaonganh: {type: Date},
    thebhyt: {type: String},
    sohieu: {type: String},
    capbac_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CapBac'},
    chucvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'ChucVu'},
    donvi_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DonVi'},
    lucluong_id: {type: mongoose.Schema.Types.ObjectId, ref: 'LucLuong'},
    is_deleted: {type: Boolean, default: false, select: false}
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt:
        'updated_at',
    }
  }
  )
;

canbonganhSchema.plugin(mongoosePaginate);

export default mongoose.model('CanBoNganh', canbonganhSchema);

