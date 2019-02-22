import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImportMaterialDetail } from '../models/import-material-detail.model';

@Injectable({
    providedIn: 'root'
})
export class ExportMaterialDetailService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    addNew(exportDetailParams: any) {
        return this.http.post(this.baseUrl + 'XuatVatTu/insertXuatChiTiet', exportDetailParams);
    }

    update(exportDetailParams: any) {
        return this.http.put(this.baseUrl + 'XuatVatTu/updateXuatChiTietAsync', exportDetailParams);
    }

    getAllByImportId(exportId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetDetail/' + exportId).pipe(
            map((res: any) => {
                return res.listxuatchitiet;
            })
        );
    }

    getDetail(exportId: any, importId: any, materialId: any) {
        return this.http.get(this.baseUrl + `XuatVatTu/GetXuatChiTiet/${exportId}/${importId}/${materialId}`);
    }

    checkDuplicate(exportId: any, importId: any, materialId: any) {
        return this.http.get(this.baseUrl + `XuatVatTu/CheckTonTaiVTChitiet/${exportId}/${importId}/${materialId}`);
    }

    delete(exportId, importId, materialId, storeId) {
        return this.http.delete(this.baseUrl + `XuatVatTu/deleteXuatChiTiet/${exportId}/${importId}/${materialId}/${storeId}`);
    }

    getDetailPrice(exportId, importId, materialId) {
        return this.http.get(this.baseUrl + `XuatVatTu/getDonGiaChiTietXuat/${exportId}/${importId}/${materialId}`);
    }
}
