import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidationDetailService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  addNew(thanhLyChiTietlParams: any) {
    return this.http.post(this.baseUrl + 'ThanhLyVatTu/InsertThanhLyChiTiet', thanhLyChiTietlParams);
  }

  update(thanhLyChiTietlParams: any) {
    return this.http.put(this.baseUrl + 'ThanhLyVatTu/updateThanhLyChiTietAsync', thanhLyChiTietlParams);
  }

  getDetailsByLiquidationId(liquidationId: number) {
    return this.http.get(this.baseUrl + 'ThanhLyVatTu/GetDetail/' + liquidationId).pipe(
      map((res: any) => {
        return res.listThanhlychitiet;
      })
    );
  }

  checkDuplicate(liquidationId: any, importId: any, materialId: any) {
    return this.http.get(this.baseUrl + `ThanhLyVatTu/CheckTonTaiVTChitiet/${liquidationId}/${importId}/${materialId}`);
  }

  delete(liquidationId, importId, materialId, storeId) {
    return this.http.delete(this.baseUrl + `ThanhLyVatTu/deleteThanhLyChiTietAsync/${liquidationId}/${importId}/${materialId}/${storeId}`);
  }
}
