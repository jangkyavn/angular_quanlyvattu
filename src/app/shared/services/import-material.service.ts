import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UtilitiesService } from './utilities.service';

import { environment } from 'src/environments/environment';
import { ImportMaterial } from '../models/import-material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
    providedIn: 'root'
})
export class ImportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private utility: UtilitiesService) { }

    getAll() {
        return this.http.get(this.baseUrl + 'NhapVatTu')
            .pipe(catchError(error => this.utility.handleError(error, 'getAllImportMaterial')));
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
            params = params.append('searchKey', pagingParams.searchKey);
            params = params.append('searchValue', pagingParams.searchValue);
        }

        return this.http.get<ImportMaterial[]>(this.baseUrl + 'NhapVatTu/getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                }),
                catchError(error => this.utility.handleError(error, 'getAllPagingImportMaterial'))
            );
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'NhapVatTu/' + id)
            .pipe(catchError(error => this.utility.handleError(error, 'getDetailImportMaterial')));
    }

    addNew(importMaterial: ImportMaterial) {
        return this.http.post(this.baseUrl + 'NhapVatTu/insertNhapVatTu', importMaterial)
            .pipe(catchError(error => this.utility.handleError(error, 'addNewImportMaterial')));
    }

    update(importMaterial: ImportMaterial) {
        return this.http.put(this.baseUrl + 'NhapVatTu/updateNhapVatTu', importMaterial)
            .pipe(catchError(error => this.utility.handleError(error, 'updateImportMaterial')));
    }

    delete(importId: any) {
        return this.http.delete(this.baseUrl + 'NhapVatTu/' + importId)
            .pipe(catchError(error => this.utility.handleError(error, 'deleteImportMaterial')));
    }

    deleteImportDetail(importId, materialId, inventoryId) {
        return this.http.delete(this.baseUrl + `NhapVatTu/removeNhapchitiet/${importId}/${materialId}/${inventoryId}`)
            .pipe(catchError(error => this.utility.handleError(error, 'deleteImportMaterialDetail')));
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
