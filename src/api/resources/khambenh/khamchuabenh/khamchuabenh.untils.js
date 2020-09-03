import KhamChuaBenh from './khamchuabenh.model';
import CanBo from '../../canbo/canbo.model';
import BenhVien from '../../danhmuc/benhvien/benhvien.model';
import Benh from '../../danhmucbenh/benh/benh.model';
import KhamSucKhoe from '../khamsuckhoe/khamsuckhoe.model';

export async function thongTinCanBo(data) {
  // kiểm tra xem mã rher bhyt đã tồn tại hay chưa.
  let canbo_id = ''
  let thebhyt = data.thebhyt
  // thông tin thẻ bhyt.
  let canboInfo = await CanBo.findOne({thebhyt: thebhyt});
  if(canboInfo){
    canbo_id = canboInfo._id
  }else{
    // thêm mới cán bộ.
    let hoten = data.hoten;
    let ho = hoten.split(' ').slice(0, -1).join(' ');
    let ten = hoten.split(' ').slice(-1).join(' ');
    ho = ho ? ho.trim() : '';
    ten = ten ? ten.trim() : '';
    let canboAdd = await CanBo.create({thebhyt: thebhyt, hoten: data.hoten, ho, ten});
    canbo_id = canboAdd._id
  }
  data.canbo_id = canbo_id

  // thông tin của bệnh viện.

  // kiểm tra xem mã bệnh viện đã tồn tại chưa.
  let benhvien_id = '';
  let benhvienInfo = await BenhVien.findOne({mabenhvien: data.mabenhvien});
  if(benhvienInfo){
    benhvien_id = benhvienInfo._id
  }else{
    // thêm mới bệnh viện.
    let benhvienAdd = await BenhVien.create({mabenhvien: data.mabenhvien, tenbenhvien: data.tenbenhvien});
    benhvien_id = benhvienAdd._id
  }
  data.benhvien_id = benhvien_id
  // data = tudongxeploai(data)
  return data
}

/*
* Tự động xếp loại khi thêm mới dữ liệu khám chữa bệnh.
* Khi thêm mới thì thêm 1 dữ liệu Khám Sức Khỏe.
* */
export async function tudongxeploai(data) {
  // nhombenh_id
  try {
    let objKhamSucKhoe = {
      canbo_id: data.canbo_id,
      khamchuabenh_id: data._id,
      tuxeploai: false,
      khamchuabenh: true
    }

    // danh sách bệnh chính.
    let mabenhchinh = []
    let mabenhkhamchuabenh = []
    let khambenh = data.khambenh ? data.khambenh : []
    let dieutri = data.dieutri ? data.dieutri : []

    khambenh.forEach(curr => {
      let benhicd = curr.benhicd ? curr.benhicd : [];
      benhicd.forEach(benh => {
        if(benh.benhchinh) mabenhchinh = [...mabenhchinh, benh.mabenh]

        if(mabenhkhamchuabenh.indexOf(benh.mabenh) === -1){
          mabenhkhamchuabenh = [...mabenhkhamchuabenh, benh.mabenh]
        }
      })
    })

    dieutri.forEach(curr => {
      let benhicd = curr.benhicd ? curr.benhicd : [];
      benhicd.forEach(benh => {
        if(benh.benhchinh) mabenhchinh = [...mabenhchinh, benh.mabenh]

        if(mabenhkhamchuabenh.indexOf(benh.mabenh) === -1){
          mabenhkhamchuabenh = [...mabenhkhamchuabenh, benh.mabenh]
        }
      })
    })

    let dsBenh = await Benh.find({is_deleted: false, mabenh: {$in: mabenhkhamchuabenh}})
      .populate({path: 'xeploai_id', select: 'xeploai thutu'});

    let thutu = 0;
    let xeploai_id = '';
    let nhombenh_id = []
    dsBenh.forEach(curr => {
      let nhombenh_id = curr.nhombenh_id ? curr.nhombenh_id.toString() : ''
      if(nhombenh_id){
        if(nhombenh_id.indexOf(nhombenh_id) === -1){
          nhombenh_id = [...nhombenh_id, nhombenh_id]
        }
      }

      if(curr.xeploai_id && curr.xeploai_id.thutu > thutu){
        thutu = curr.xeploai_id.thutu;
        xeploai_id = curr.xeploai_id._id
      }
    })
    if(xeploai_id){
      objKhamSucKhoe.xeploai_id = xeploai_id
    }
    objKhamSucKhoe.nhombenh_id = nhombenh_id;
    // tạo mới 1 khám sức khỏe.
    let khamsuckhoeInfo = await KhamSucKhoe.create(objKhamSucKhoe)
    let khamchuabenhInfo = await KhamChuaBenh.findByIdAndUpdate(data._id, {khamsuckhoe_id: khamsuckhoeInfo._id}, { new: true });

  }catch (e) {
    console.log(e)
  }
}

export function tinhtongtien(objData, arrDuLieu = []) {
  for(let i=0; i< arrDuLieu.length; i++){
    let data = arrDuLieu[i];
    if(data){
      objData.thanhtien += data.thanhtien ? parseFloat(data.thanhtien) : 0
      objData.tienbh += data.tienbh ? parseFloat(data.tienbh) : 0
      objData.tienbnpt += data.tienbnpt ? parseFloat(data.tienbnpt) : 0
    }
  }

  return objData
}
