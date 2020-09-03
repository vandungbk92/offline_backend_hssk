import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;

const khamchuabenhSchema = new Schema({

    mabenhvien: {type: String},
    tenbenhvien: {type: String},
    makcb: {type: String},
    thebhyt: {type: String},
    hoten: {type: String},
    canbo_id: {type: mongoose.Schema.Types.ObjectId, ref: 'CanBo'},
    benhvien_id: {type: mongoose.Schema.Types.ObjectId, ref: 'BenhVien'},

    khamsuckhoe_id: {type: mongoose.Schema.Types.ObjectId, ref: 'KhamSucKhoe'},
    xeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'XepLoaiSucKhoe'},
    tuxeploai: {type: Boolean, default: false},
    thoigianxeploai: {type: Date},
    nguoixeploai_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    khambenh: [{
      makhambenh: {type: String},
      ngaykham: {type: String},
      makhoa: {type: String},
      tenkhoa: {type: String},
      mabacsy: {type: String},
      tenbacsy: {type: String},
      maphong: {type: String},
      tenphong: {type: String},
      trieuchung: {type: String},
      chandoansobo: {type: String},

      // chỉ số sinh tồn.
      huyetap: {type: String},
      mach: {type: String},
      nhietdo: {type: String},
      nhiptho: {type: String},
      chieucao: {type: String},
      cannang: {type: String},
      bmi: {type: String},
      vongbung: {type: String},

      benhicd: [
        {
          benhchinh: {type: Boolean, default: false},
          mabenh: {type: String},
          tenbenh: {type: String},
          ghichu: {type: String},
          manhom: {type: String},
          tennhom: {type: String}
        }
      ],
      thuoc: [{
        mathuoc: {type: String},
        tenthuoc: {type: String},
        soluong: {type: Number},
        cachdung: {type: String},

        dongia: {type: Number},
        thanhtien: {type: Number},
        tienbnpt: {type: Number},
        tienbh: {type: Number},
        muchuong: {type: Number},
        tienbn100: {type: Number},
        tienchenh: {type: Number}
      }],
      dichvu: [{
        madichvu: {type: String},
        tendichvu: {type: String},
        soluong: {type: Number},
        chiso: [{
          machiso: {type: String},
          tenchiso: {type: String},
          donvitinh: {type: String},
          ketqua: {type: String},
          min: {type: String},
          max: {type: String},
        }],
        ketqua: {type: String},
        ketluan: {type: String},

        dongia: {type: Number},
        thanhtien: {type: Number},
        tienbnpt: {type: Number},
        tienbh: {type: Number},
        muchuong: {type: Number},
        tienbn100: {type: Number},
        tienchenh: {type: Number}
      }],
      tuvong: {type: Boolean, default: false},
    }],

    dieutri: [{
      madieutri: {type: String},
      ngayvaokhoa: {type: String},
      makhoa: {type: String},
      tenkhoa: {type: String},
      maphong: {type: String},
      tenphong: {type: String},
      magiuong: {type: String},
      tengiuong: {type: String},
      mabacsy: {type: String},
      tenbacsy: {type: String},
      songaydieutri: {type: String},
      hinhthucravien: {type: String},
      ketquadieutri: {type: String},
      phuongphapdieutri: {type: String},
      dando: {type: String},
      ngayrv: {type: String},
      dotdieutri: {type: String},
      benhicd: [{
        benhchinh: {type: Boolean, default: false},
        mabenh:  {type: String},
        tenbenh: {type: String},
        ghichu:  {type: String},
        manhom:  {type: String},
        tennhom: {type: String},
      }],
      ylenh: [{
        ngayylenh: {type: String},
        mabacsy: {type: String},
        tenbacsy: {type: String},
        thuoc: [{
          mathuoc: {type: String},
          tenthuoc: {type: String},
          soluong: {type: Number},
          cachdung: {type: String},
          dongia: {type: Number},
          thanhtien: {type: Number},
          tienbnpt: {type: Number},
          tienbh: {type: Number},
          muchuong: {type: Number},
          tienbn100: {type: Number},
          tienchenh: {type: Number}
        }],
        dichvu: [{
          madichvu: {type: String},
          tendichvu: {type: String},
          soluong: {type: Number},
          ketqua: {type: String},
          ketluan: {type: String},

          dongia: {type: Number},
          thanhtien: {type: Number},
          tienbnpt: {type: Number},
          tienbh: {type: Number},
          muchuong: {type: Number},
          tienbn100: {type: Number},
          tienchenh: {type: Number},

          chiso: [{
            machiso: {type: String},
            tenchiso: {type: String},
            donvitinh: {type: String},
            ketqua: {type: String},
            min: {type: String},
            max: {type: String},
          }]
        }]
      }],
      tuvong: {type: Boolean, default: false}
    }],

    chuyenvien: {
      mabenhvienden: {type: String},
      tenbenhvienden: {type: String},
      ngaychuyen: {type: String},
      makhoa: {type: String},
      tenkhoa: {type: String}
    },
    is_deleted: {type: Boolean, default: false, select: false}
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }});

khamchuabenhSchema.plugin(mongoosePaginate);

export default mongoose.model('KhamChuaBenh', khamchuabenhSchema);

