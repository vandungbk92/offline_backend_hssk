export function thongTinKhoaKhamBenh(data, chuyenkhoa) {
  let objData  = {}

  let bacsy = chuyenkhoa + '_bacsy_id';
  let ngaykham = chuyenkhoa + '_ngaykham';
  let benh = chuyenkhoa + '_benh_id';
  let xeploai = chuyenkhoa + '_xeploai_id';

  objData[chuyenkhoa] = data[chuyenkhoa]
  objData[bacsy] = data[bacsy]
  objData[ngaykham] = data[ngaykham]
  objData[benh] = data[benh]
  objData[xeploai] = data[xeploai]

  return objData
}


