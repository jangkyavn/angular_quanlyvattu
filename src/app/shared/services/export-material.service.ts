import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { ExportMaterial } from '../models/export-material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { Inventory } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class ExportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private utility: UtilitiesService) { }

    getAll() {
        return this.http.get(this.baseUrl + 'XuatVatTu')
            .pipe(catchError(error => this.utility.handleError(error, 'getAllExportMaterial')));
    }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<ExportMaterial[]>> {
        const paginatedResult = new PaginatedResult<ExportMaterial[]>();

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

        return this.http.get<ExportMaterial[]>(this.baseUrl + 'XuatVatTu/getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                }),
                catchError(error => this.utility.handleError(error, 'getAllPagingExportMaterial'))
            );
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetDetail/' + id)
            .pipe(catchError(error => this.utility.handleError(error, 'getDetailExportMaterial')));
    }

    addNew(exportMaterial: ExportMaterial) {
        return this.http.post(this.baseUrl + 'XuatVatTu/insertXuatVatTu', exportMaterial)
            .pipe(catchError(error => this.utility.handleError(error, 'addNewExportMaterial')));
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

    getInventoriesByStoreId(
        page?: any,
        itemsPerPage?: any,
        pagingParams?: PagingParams,
        storeId?: any,
        exportDate?: any): Observable<PaginatedResult<Inventory[]>> {
        const paginatedResult = new PaginatedResult<Inventory[]>();

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

        if (storeId != null) {
            params = params.append('maKho', storeId);
        }

        if (exportDate != null) {
            params = params.append('ngayxuat', exportDate);
        }

        return this.http.get<Inventory[]>(this.baseUrl + 'XuatVatTu/GetListByMaKho', { observe: 'response', params })
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

    update(exportMaterial: ExportMaterial) {
        return this.http.put(this.baseUrl + 'XuatVatTu/updateXuatVatTu', exportMaterial)
            .pipe(catchError(error => this.utility.handleError(error, 'updateExportMaterial')));
    }

    delete(exportId: any) {
        return this.http.delete(this.baseUrl + 'XuatVatTu/' + exportId)
            .pipe(catchError(error => this.utility.handleError(error, 'deleteExportMaterial')));
    }

    deleteExportDetails(exportId, importId, materialId, inventoryId) {
        return this.http.delete(this.baseUrl + `XuatVatTu/deleteXuatChiTiet/${exportId}/${importId}/${materialId}/${inventoryId}`);
    }

    checkQuantity(importId, materialId, quantity) {
        return this.http.get(this.baseUrl + `XuatVatTu/CheckSoLuongXuatChiTietAsync/${importId}/${materialId}/${quantity}`);
    }
}
