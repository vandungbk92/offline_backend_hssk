import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const dotkhambenhSchema = new Schema({
    dotkhambenh: {type: String, required: true},
    ngaybatdau: {type: Date},
    ngayketthuc: {type: Date},
    is_deleted: {type: Boolean, default: false}
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  });

dotkhambenhSchema.plugin(mongoosePaginate);

export default mongoose.model('DotKhamBenh', dotkhambenhSchema);
