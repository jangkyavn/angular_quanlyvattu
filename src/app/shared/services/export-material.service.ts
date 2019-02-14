import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExportMaterial } from '../models/export-material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

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

    getInventoriesById(storeId: number, keyword: any = null) {
        return this.http.get(this.baseUrl + `XuatVatTu/GetListByMaKho/${storeId}/${keyword}`);
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
