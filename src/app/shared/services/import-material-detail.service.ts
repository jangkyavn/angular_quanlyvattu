import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImportMaterialDetail } from '../models/import-material-detail.model';

@Injectable({
    providedIn: 'root'
})
export class ImportMaterialDetailService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    addNew(importDetailParams: any) {
        return this.http.post(this.baseUrl + 'NhapVatTu/insertChiTiet', importDetailParams);
    }

    update(importDetailParams: any) {
        return this.http.put(this.baseUrl + 'NhapVatTu/updateNhapChiTiet', importDetailParams);
    }

    checkDuplicate(importId: any, materialId: any) {
        return this.http.get(this.baseUrl + `NhapVatTu/CheckTonTaiVTChitiet/${importId}/${materialId}`);
    }

    getAllByImportId(importId: number) {
        return this.http.get(this.baseUrl + 'NhapVatTu/' + importId).pipe(
            map((res: any) => {
                return res.listnhapchitiet;
            })
        );
    }

    delete(importId: number, materialId: number, storeId: number) {
        return this.http.delete(this.baseUrl + `NhapVatTu/removeNhapchitiet/${importId}/${materialId}/${storeId}`);
    }
}
