import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ImportMaterial } from '../models/import-material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class ImportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(this.baseUrl + 'NhapVatTu');
    }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<ImportMaterial[]>> {
        const paginatedResult = new PaginatedResult<ImportMaterial[]>();

        let params = new HttpParams();
        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page);
            params = params.append('pageSize', itemsPerPage);
        }

        if (pagingParams != null) {
            params = params.append('keyword', pagingParams.keyword);
            params = params.append('fromDate', pagingParams.fromDate);
            params = params.append('toDate', pagingParams.toDate);
            params = params.append('sortKey', pagingParams.sortKey);
            params = params.append('sortValue', pagingParams.sortValue);
        }

        return this.http.get<ImportMaterial[]>(this.baseUrl + 'NhapVatTu/getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                })
            );
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'NhapVatTu/' + id);
    }

    addNew(importMaterial: ImportMaterial) {
        return this.http.post(this.baseUrl + 'NhapVatTu/insertNhapVatTu', importMaterial);
    }

    update(importMaterial: ImportMaterial) {
        return this.http.put(this.baseUrl + 'NhapVatTu/updateNhapVatTu', importMaterial);
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

    checkUpdateImportDate(importId?: any) {
        return this.http.get(this.baseUrl + 'NhapVatTu/CheckUpdateNgayNhap/' + importId);
    }
}
