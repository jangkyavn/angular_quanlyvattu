import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class LiquidationDetailService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  addNew(thanhLyChiTietlParams: any) {
    return this.http.post(this.baseUrl + 'ThanhLyVatTu/InsertThanhLyChiTiet', thanhLyChiTietlParams)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewLiquidationMaterialDetail')));
  }

  update(thanhLyChiTietlParams: any) {
    return this.http.put(this.baseUrl + 'ThanhLyVatTu/updateThanhLyChiTietAsync', thanhLyChiTietlParams)
      .pipe(catchError(error => this.utility.handleError(error, 'updateLiquidationMaterialDetail')));
  }

  getDetailsByLiquidationId(liquidationId: number) {
    return this.http.get(this.baseUrl + 'ThanhLyVatTu/GetDetail/' + liquidationId).pipe(
      map((res: any) => {
        return res.listThanhlychitiet;
      }),
      catchError(error => this.utility.handleError(error, 'getDetailsByLiquidationId'))
    );
  }

  checkDuplicate(liquidationId: any, importId: any, materialId: any) {
    return this.http.get(this.baseUrl + `ThanhLyVatTu/CheckTonTaiVTChitiet/${liquidationId}/${importId}/${materialId}`)
      .pipe(catchError(error => this.utility.handleError(error, 'checkDuplicateLiquidationMaterialDetail')));
  }

  delete(liquidationId, importId, materialId, storeId) {
    return this.http.delete(this.baseUrl + `ThanhLyVatTu/deleteThanhLyChiTietAsync/${liquidationId}/${importId}/${materialId}/${storeId}`)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteLiquidationMaterialDetail')));
  }
}
