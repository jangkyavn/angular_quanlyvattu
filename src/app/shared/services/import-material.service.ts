import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(this.baseUrl + 'NhapVatTu');
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'NhapVatTu/' + id);
    }

    addNew(importMaterialParams: any) {
        return this.http.post(this.baseUrl + 'NhapVatTu', importMaterialParams);
    }

    update(importMaterialParams: any) {
        return this.http.put(this.baseUrl + 'NhapVatTu', importMaterialParams);
    }

    delete(importId: any) {
        return this.http.delete(this.baseUrl + 'NhapVatTu/' + importId);
    }

    deleteImportDetail(importId, materialId, inventoryId) {

        return this.http.delete(this.baseUrl + `NhapVatTu/removeNhapchitiet/${importId}/${materialId}/${inventoryId}`);
    }

    checkStatusDeleteDetail(importId, materialId, inventoryId) {
        return this.http.get(this.baseUrl + `NhapVatTu/CheckStatus/${importId}/${materialId}/${inventoryId}`);
    }

    checkQuantity(importId, inventoryId, materialId, quantity) {
        return this.http.get(this.baseUrl + `NhapVatTu/CheckSoLuongNhapChiTietAsync/${importId}/${inventoryId}/${materialId}/${quantity}`);
    }
}
