import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(this.baseUrl + 'XuatVatTu');
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetDetail/' + id);
    }

    addNew(exportMaterialParams: any) {
        return this.http.post(this.baseUrl + 'XuatVatTu', exportMaterialParams);
    }

    getImportsByStoreId(storeId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetByMaKho/' + storeId);
    }

    getMaterialsByImportId(importId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetListVTByMaPN/' + importId);
    }

    getMaterialsByStoreId(storeId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetListVatTuByMaKho/' + storeId);
    }

    getImportsByMaterialId(materialId: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetListNhapChiTietByMaVT/' + materialId);
    }

    update(exportMaterialParams: any) {
        return this.http.put(this.baseUrl + 'XuatVatTu', exportMaterialParams);
    }

    delete(exportId: any) {
        return this.http.delete(this.baseUrl + 'XuatVatTu/' + exportId);
    }

    deleteExportDetails(exportId, importId, materialId, inventoryId) {
        return this.http.delete(this.baseUrl + `XuatVatTu/deleteXuatChiTiet/${exportId}/${importId}/${materialId}/${inventoryId}`);
    }
}
