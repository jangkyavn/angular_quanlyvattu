import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';


@Injectable({
    providedIn: 'root'
})
export class ExportMaterialDetailService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private utility: UtilitiesService) { }

    addNew(exportDetailParams: any) {
        return this.http.post(this.baseUrl + 'XuatVatTu/insertXuatChiTiet', exportDetailParams)
            .pipe(catchError(error => this.utility.handleError(error, 'addNewExportMaterialDetail')));
    }

    update(exportDetailParams: any) {
        return this.http.put(this.baseUrl + 'XuatVatTu/updateXuatChiTietAsync', exportDetailParams)
            .pipe(catchError(error => this.utility.handleError(error, 'updateExportMaterialDetail')));
    }

    getAllByImportId(exportId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetDetail/' + exportId).pipe(
            map((res: any) => {
                return res.listxuatchitiet;
            }),
            catchError(error => this.utility.handleError(error, 'getAllByImportIdExportMaterialDetail'))
        );
    }

    getDetail(exportId: any, importId: any, materialId: any) {
        return this.http.get(this.baseUrl + `XuatVatTu/GetXuatChiTiet/${exportId}/${importId}/${materialId}`)
            .pipe(catchError(error => this.utility.handleError(error, 'getDetailExportMaterialDetail')));
    }

    checkDuplicate(exportId: any, importId: any, materialId: any) {
        return this.http.get(this.baseUrl + `XuatVatTu/CheckTonTaiVTChitiet/${exportId}/${importId}/${materialId}`)
            .pipe(catchError(error => this.utility.handleError(error, 'checkDuplicateExportMaterialDetail')));
    }

    delete(exportId, importId, materialId, storeId) {
        return this.http.delete(this.baseUrl + `XuatVatTu/deleteXuatChiTiet/${exportId}/${importId}/${materialId}/${storeId}`)
            .pipe(catchError(error => this.utility.handleError(error, 'deleteExportMaterialDetail')));
    }

    getDetailPrice(exportId, importId, materialId) {
        return this.http.get(this.baseUrl + `XuatVatTu/getDonGiaChiTietXuat/${exportId}/${importId}/${materialId}`)
            .pipe(catchError(error => this.utility.handleError(error, 'getDetailPriceExportMaterialDetail')));
    }
}
