import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const canboSchema = new Schema({
    hoten: {type: String, required: true,},
    ho: {type: String},
    ten: {type: String},

    gioitinh: {type: String},
    ngaysinh: {type: Date},

    dantoc_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DanToc'},
    quoctich_id: {type: mongoose.Schema.Types.ObjectId, ref: 'QuocTich'},
    tongiao_id: {type: mongoose.Schema.Types.ObjectId, ref: 'TonGiao'},
    nhommau_id: {type: mongoose.Schema.Types.ObjectId, ref: 'NhomMau'},
    herh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'HeRh'},

    thebhyt: {type: String, required: true},
    khaisinh_tinh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh'},
    cmnd: {type: String},
    ngaycap_cmnd: {type: Date},
    noicap_cmnd: {type: String},

    cannang: {type: Number},
    chieucao: {type: Number},
    bmi: {type: Number},

    cannanglucde: {type: Number},
    chieudailucde: {type: Number},
    ditatbamsinh: {type: String},

    hutthuoc_khong: {type: Boolean, default: false},
    hutthuoc_co: {type: Boolean, default: false},
    hutthuoc_thuongxuyen: {type: Boolean, default: false},
    hutthuoc_dabo: {type: Boolean, default: false},

    ruoubia_khong: {type: Boolean, default: false},
    ruoubia_co: {type: Boolean, default: false},
    ruoubia_thuongxuyen: {type: Boolean, default: false},
    ruoubia_lycocngay: {type: String},

    matuy_khong: {type: Boolean, default: false},
    matuy_co: {type: Boolean, default: false},
    matuy_thuongxuyen: {type: Boolean, default: false},
    matuy_dabo: {type: Boolean, default: false},

    hoatdongtheluc_co: {type: Boolean, default: false},
    hoatdongtheluc_khong: {type: Boolean, default: false},
    hoatdongtheluc_thuongxuyen: {type: Boolean, default: false},

    tiepxucnghenghiep: {type: String},
    tiepxucnghenghiep_thoigian: {type: String},
    nguycokhac: {type: String},

    diungthuoc: {type: String},
    diunghoachat: {type: String},
    diungthucpham: {type: String},
    diungkhac: {type: String},

    timmach: {type: Boolean, default: false},
    tanghuyetap: {type: Boolean, default: false},
    daithaoduong: {type: Boolean, default: false},
    daday: {type: Boolean, default: false},
    phoimantinh: {type: Boolean, default: false},
    hensuyen: {type: Boolean, default: false},
    buouco: {type: Boolean, default: false},
    viemgan: {type: Boolean, default: false},
    timbamsinh: {type: Boolean, default: false},
    tamthan: {type: Boolean, default: false},
    tuky: {type: Boolean, default: false},
    dongkinh: {type: Boolean, default: false},

    benhungthu: {type: String},
    benhlao: {type: String},
    benhkhac: {type: String},

    tiensuphauthuat: {type: String},


    vandeytekhac: {type: String},
    nguycosuckhoe: {type: String},
    dethieuthang: {type: Boolean, default: false},
    bingatlucde: {type: Boolean, default: false},
    dethuong: {type: Boolean, default: false},
    demo: {type: Boolean, default: false},


    hktt: {type: String},
    hktt_tinh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh'},
    hktt_qh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'QuanHuyen'},
    hktt_px_id: {type: mongoose.Schema.Types.ObjectId, ref: 'PhuongXa'},

    diachi: {type: String},
    tinhthanh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh'},
    quanhuyen_id: {type: mongoose.Schema.Types.ObjectId, ref: 'QuanHuyen'},
    phuongxa_id: {type: mongoose.Schema.Types.ObjectId, ref: 'PhuongXa'},

    email: {type: String},
    didong: {type: String},
    dienthoai: {type: String},
    hotenme: {type: String},
    hotenbo: {type: String},
    ncsc: {type: String},
    ncsc_mqh: {type: String},
    dienthoai_nguoithan: {type: String},
    didong_nguoithan: {type: String},

    is_deleted: {type: Boolean, default: false, select: false}
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt:
        'updated_at',
    }
  });

canboSchema.plugin(mongoosePaginate);
export default mongoose.model('CanBo', canboSchema);

