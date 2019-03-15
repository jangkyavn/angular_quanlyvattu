import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

@Injectable({
    providedIn: 'root'
})
export class ImportMaterialDetailService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private utility: UtilitiesService) { }

    addNew(importDetailParams: any) {
        return this.http.post(this.baseUrl + 'NhapVatTu/insertChiTiet', importDetailParams)
            .pipe(catchError(error => this.utility.handleError(error, 'addNewImportMaterialDetail')));
    }

    update(importDetailParams: any) {
        return this.http.put(this.baseUrl + 'NhapVatTu/updateNhapChiTiet', importDetailParams)
        .pipe(catchError(error => this.utility.handleError(error, 'updateImportMaterialDetail')));
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
        return this.http.delete(this.baseUrl + `NhapVatTu/removeNhapchitiet/${importId}/${materialId}/${storeId}`)
        .pipe(catchError(error => this.utility.handleError(error, 'deleteImportMaterialDetail')));
    }
}
