import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { InventoryMaterial } from '../models/inventory-material.model';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryMaterialService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<InventoryMaterial[]>> {
    const paginatedResult = new PaginatedResult<InventoryMaterial[]>();

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

    return this.http.get<InventoryMaterial[]>(this.baseUrl + 'KiemKeVatTu/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingInventoryMaterial'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'KiemKeVatTu/getDetailById/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailInventoryMaterial')));
  }

  addNew(inventoryMaterial: InventoryMaterial) {
    return this.http.post(this.baseUrl + 'KiemKeVatTu/insertKiemKeVatTuAsync', inventoryMaterial)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewInventoryMaterial')));
  }

  update(inventoryMaterial: InventoryMaterial) {
    return this.http.put(this.baseUrl + 'KiemKeVatTu/updateKiemKeVatTuAsync', inventoryMaterial)
      .pipe(catchError(error => this.utility.handleError(error, 'updateInventoryMaterial')));
  }

  delete(inventoryMaterialId: any) {
    return this.http.delete(this.baseUrl + 'KiemKeVatTu/' + inventoryMaterialId)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteInventoryMaterial')));
  }

  getInventories(page?: any,
      itemsPerPage?: any,
      pagingParams?: PagingParams,
      storeId?: any,
      importId?: any,
      materialId?: any,
      inventoryMaterialId?: any,
      status?: any): Observable<PaginatedResult<Inventory[]>> {
    const paginatedResult = new PaginatedResult<Inventory[]>();

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

    params = params.append('maKho', storeId);
    params = params.append('maPN', importId);
    params = params.append('maVT', materialId);
    params = params.append('maPKK', inventoryMaterialId);
    params = params.append('status', status);

    return this.http.get<Inventory[]>(this.baseUrl + 'KiemKeVatTu/getListKho', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingInventoriesInventoryMaterial'))
      );
  }
}
