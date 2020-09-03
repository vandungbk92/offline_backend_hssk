import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const khamsuckhoeSchema = new Schema({
    canbo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CanBo', required: true},
    dotkhambenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DotKhamBenh'},
    ngaykham: {type: Date},

    huyetap: {type: Number},
    mach: {type: Number},
    nhietdo: {type: Number},
    nhiptho: {type: Number},
    chieucao: {type: Number},
    cannang: {type: Number},
    bmi: {type: Number},
    vongbung: {type: Number},
    tuoi: {type: Number},

    khamchuabenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'KhamChuaBenh'},
    khamchuabenh: {type: Boolean, default: false},
    tuxeploai: {type: Boolean, default: false},
    nguoixeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    thoigianxeploai: {type: Date},
    xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},

    nhombenh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'NhomBenh'}],
    vandeluuy: {type: String},
    trangthai: {type: Number, default: -1},
    is_deleted: {type: Boolean, default: false},
    dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      ketqua: {type: String},
      teptin: []
    }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  });

khamsuckhoeSchema.plugin(mongoosePaginate);

export default mongoose.model('KhamSucKhoe', khamsuckhoeSchema);

