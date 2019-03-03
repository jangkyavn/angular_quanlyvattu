import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExportMaterial } from '../models/export-material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { Inventory } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class ExportMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(this.baseUrl + 'XuatVatTu');
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
                })
            );
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'XuatVatTu/GetDetail/' + id);
    }

    addNew(exportMaterial: ExportMaterial) {
        return this.http.post(this.baseUrl + 'XuatVatTu/insertXuatVatTu', exportMaterial);
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
        storeId?: any): Observable<PaginatedResult<Inventory[]>> {
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
        return this.http.put(this.baseUrl + 'XuatVatTu/updateXuatVatTu', exportMaterial);
    }

    delete(exportId: any) {
        return this.http.delete(this.baseUrl + 'XuatVatTu/' + exportId);
    }

    deleteExportDetails(exportId, importId, materialId, inventoryId) {
        return this.http.delete(this.baseUrl + `XuatVatTu/deleteXuatChiTiet/${exportId}/${importId}/${materialId}/${inventoryId}`);
    }

    checkQuantity(importId, materialId, quantity) {
        return this.http.get(this.baseUrl + `XuatVatTu/CheckSoLuongXuatChiTietAsync/${importId}/${materialId}/${quantity}`);
    }
}
