import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { LiquidationMaterial } from '../models/liquidation-material.model';
import { Inventory } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class LiquidationMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<LiquidationMaterial[]>> {
        const paginatedResult = new PaginatedResult<LiquidationMaterial[]>();

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

        return this.http.get<LiquidationMaterial[]>(this.baseUrl + 'ThanhLyVatTu/getAllPaging', { observe: 'response', params })
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

    addNew(liquidation: LiquidationMaterial) {
        return this.http.post(this.baseUrl + 'ThanhLyVatTu/InserThanhLyVatTu', liquidation);
    }

    update(liquidation: LiquidationMaterial) {
        return this.http.put(this.baseUrl + 'ThanhLyVatTu/updateThanhLyVatTuAsync', liquidation);
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'ThanhLyVatTu/GetDetail/' + id);
    }

    getInventoriesById(storeId: number, keyword: any = null) {
        return this.http.get(this.baseUrl + `ThanhLyVatTu/GetListByMaKho/${storeId}/${keyword}`);
    }

    delete(liquidationId: any) {
        return this.http.delete(this.baseUrl + 'ThanhLyVatTu/' + liquidationId);
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

        return this.http.get<Inventory[]>(this.baseUrl + 'ThanhLyVatTu/GetListByMaKho', { observe: 'response', params })
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
}
