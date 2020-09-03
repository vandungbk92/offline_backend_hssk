import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const canlamsangSchema = new Schema({
    canbo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CanBo'},
    khamsuckhoe_id: {type: mongoose.Schema.Types.ObjectId, ref: 'KhamSucKhoe'},
    dotkhambenh_id: {type: mongoose.Schema.Types.ObjectId, ref: 'DotKhamBenh'},

    soluonghongcau: {type: Number},
    soluongbachcau: {type: Number},
    huyetsacto: {type: Number},
    tieucau: {type: Number},
    congthucbachcau: {type: Number},
    glucose: {type: Number},
    hbc1c: {type: Number},
    ure: {type: Number},
    creatinin: {type: Number},
    got: {type: Number},
    gpt: {type: Number},
    ggt: {type: Number},
    hbsag: {type: Number},
    hbeag: {type: Number},
    antihcv: {type: Number},
    antihbe: {type: Number},

    cholesteroltp: {type: Number},
    triglixerit: {type: Number},
    hdlc: {type: Number},
    ldlc: {type: Number},
    bilirubin: {type: Number},
    aciduric: {type: Number},
    psa: {type: Number},
    ca199: {type: Number},
    afp: {type: Number},
    cea: {type: Number},

    glucosenieu: {type: Number},
    proteinnieu: {type: Number},
    tebaokhac: {type: Number},

    dientim: {type: String},
    kqdientim: [],

    xquangtimphoi: {type: String},
    kqxquangtimphoi: [],

    sieuamobung: {type: String},
    kqsieuamobung: [],

    sieuamtim: {type: String},
    kqsieuamtim: [],

    chupcatlop: {type: String},
    kqchupcatlop: [],

    chupconghuongtu: {type: String},
    kqchupconghuongtu: [],

    is_deleted: {type: Boolean, default: false, select: false}
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }});

canlamsangSchema.plugin(mongoosePaginate);

export default mongoose.model('CanLamSang', canlamsangSchema);

