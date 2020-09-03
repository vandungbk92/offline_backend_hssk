import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const lamsangSchema = new Schema({

    canbo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CanBo'},
    khamsuckhoe_id: {type: mongoose.Schema.Types.ObjectId, ref: 'KhamSucKhoe'},
    dotkhambenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DotKhamBenh'},

    tuanhoan: {type: String},
    tuanhoan_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tuanhoan_ngaykham: {type: Date},
    tuanhoan_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    tuanhoan_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    tuanhoan_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    hohap: {type: String},
    hohap_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    hohap_ngaykham: {type: Date},
    hohap_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    hohap_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    hohap_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    tieuhoa: {type: String},
    tieuhoa_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tieuhoa_ngaykham: {type: Date},
    tieuhoa_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    tieuhoa_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    tieuhoa_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    thantietnieu: {type: String},
    thantietnieu_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    thantietnieu_ngaykham: {type: Date},
    thantietnieu_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    thantietnieu_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    thantietnieu_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    coxuongkhop: {type: String},
    coxuongkhop_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    coxuongkhop_ngaykham: {type: Date},
    coxuongkhop_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    coxuongkhop_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    coxuongkhop_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    thankinh: {type: String},
    thankinh_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    thankinh_ngaykham: {type: Date},
    thankinh_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    thankinh_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    thankinh_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    tamthan: {type: String},
    tamthan_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    tamthan_ngaykham: {type: Date},
    tamthan_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    tamthan_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    tamthan_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    ngoaikhoa: {type: String},
    ngoaikhoa_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ngoaikhoa_ngaykham: {type: Date},
    ngoaikhoa_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    ngoaikhoa_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    ngoaikhoa_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    sanphukhoa: {type: String},
    sanphukhoa_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    sanphukhoa_ngaykham: {type: Date},
    sanphukhoa_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    sanphukhoa_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    sanphukhoa_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    mat: {type: String},
    mat_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    mat_ngaykham: {type: Date},
    mat_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    mat_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    mat_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    taimuihong: {type: String},
    taimuihong_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    taimuihong_ngaykham: {type: Date},
    taimuihong_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    taimuihong_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    taimuihong_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    ranghammat: {type: String},
    ranghammat_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ranghammat_ngaykham: {type: Date},
    ranghammat_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    ranghammat_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    ranghammat_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],

    dalieu: {type: String},
    dalieu_bacsy_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    dalieu_ngaykham: {type: Date},
    dalieu_benh_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Benh'}],
    dalieu_xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    dalieu_dichvu: [{
      dichvu_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DichVu'},
      ketqua: []
    }],


    is_deleted: {type: Boolean, default: false, select: false}
  });

lamsangSchema.plugin(mongoosePaginate);

export default mongoose.model('KhamLamSang', lamsangSchema);

