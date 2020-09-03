import KhamSucKhoe from './khamsuckhoe.model';
import CanBo from '../../canbo/canbo.model'

export async function uptTrangThaiKSK(khamsuckhoe, nhombenh_id) {
  if(khamsuckhoe.trangthai = -1){
    let data = {trangthai: 0}
    if(nhombenh_id && nhombenh_id.length){
      data.$addToSet = {nhombenh_id: [...nhombenh_id]}
    }
    await KhamSucKhoe.findByIdAndUpdate(khamsuckhoe._id, data, {new: true});
  }
}

export async function uptTuoiKSK(khamsuckhoe) {
  if(khamsuckhoe && khamsuckhoe.canbo_id){
    // thông tin của canbo
    let canboInfo = await CanBo.findById(khamsuckhoe.canbo_id)
    if(canboInfo && canboInfo.ngaysinh){

    }
  }
}


