import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilitiesService } from './utilities.service';

import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryMaterialDetailService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  addNew(kiemKeChiTietlParams: any) {
    return this.http.post(this.baseUrl + 'KiemKeVatTu/inserKiemKeChiTietAsync', kiemKeChiTietlParams)
      .pipe(catchError(error => this.utility.handleError(error, 'updateInventoryMaterialDetail')));
  }

  update(kiemKeChiTietlParams: any) {
    return this.http.put(this.baseUrl + 'KiemKeVatTu/updateKiemKeChiTietAsync', kiemKeChiTietlParams)
      .pipe(catchError(error => this.utility.handleError(error, 'updateInventoryMaterialDetail')));
  }

  delete(inventoryMaterialId?: any, importId?: any, materialId?: any, storeId?: any) {
    return this.http.delete(this.baseUrl + `KiemKeVatTu/deleteKiemKeChiTietAsync/
    ${inventoryMaterialId}/${importId}/${materialId}/${storeId}`)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteInventoryMaterialDetail')));
  }

  getDetailsByInventoryMateralId(inventoryMaterialId: number) {
    return this.http.get(this.baseUrl + 'KiemKeVatTu/getDetailById/' + inventoryMaterialId).pipe(
      map((res: any) => {
        return res.listKiemKeChiTiet;
      }),
      catchError(error => this.utility.handleError(error, 'getDetailInventoryMaterial'))
    );
  }
}
