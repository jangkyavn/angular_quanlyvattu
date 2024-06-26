import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { LiquidationMaterial } from '../models/liquidation-material.model';
import { Inventory } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class LiquidationMaterialService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient,
        private utility: UtilitiesService) { }

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
            params = params.append('searchKey', pagingParams.searchKey);
            params = params.append('searchValue', pagingParams.searchValue);
        }

        return this.http.get<LiquidationMaterial[]>(this.baseUrl + 'ThanhLyVatTu/getAllPaging', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                }),
                catchError(error => this.utility.handleError(error, 'getAllPagingLiquidationMaterial'))
            );
    }

    addNew(liquidation: LiquidationMaterial) {
        return this.http.post(this.baseUrl + 'ThanhLyVatTu/InserThanhLyVatTu', liquidation)
            .pipe(catchError(error => this.utility.handleError(error, 'addNewLiquidationMaterial')));
    }

    update(liquidation: LiquidationMaterial) {
        return this.http.put(this.baseUrl + 'ThanhLyVatTu/updateThanhLyVatTuAsync', liquidation)
            .pipe(catchError(error => this.utility.handleError(error, 'updateLiquidationMaterial')));
    }

    getDetail(id: number) {
        return this.http.get(this.baseUrl + 'ThanhLyVatTu/GetDetail/' + id)
            .pipe(catchError(error => this.utility.handleError(error, 'getDetailLiquidationMaterial')));
    }

    delete(liquidationId: any) {
        return this.http.delete(this.baseUrl + 'ThanhLyVatTu/' + liquidationId)
            .pipe(catchError(error => this.utility.handleError(error, 'deleteLiquidationMaterial')));
    }

    getInventoriesByStoreId(
        page?: any,
        itemsPerPage?: any,
        pagingParams?: PagingParams,
        storeId?: any,
        liquidationDate?: any): Observable<PaginatedResult<Inventory[]>> {
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
            params = params.append('searchKey', pagingParams.searchKey);
            params = params.append('searchValue', pagingParams.searchValue);
        }

        if (storeId != null) {
            params = params.append('maKho', storeId);
        }

        if (liquidationDate != null) {
            params = params.append('ngaythanhly', liquidationDate);
        }

        return this.http.get<Inventory[]>(this.baseUrl + 'ThanhLyVatTu/GetListByMaKho', { observe: 'response', params })
            .pipe(
                map(response => {
                    paginatedResult.result = response.body;
                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }
                    return paginatedResult;
                }),
                catchError(error => this.utility.handleError(error, 'getInventoriesByStoreId'))
            );
    }
}
