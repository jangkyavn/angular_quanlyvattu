import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { MaterialStore } from '../models/material-store.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialStoreService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'KhoVatTu')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllMaterialStore')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<MaterialStore[]>> {
    const paginatedResult = new PaginatedResult<MaterialStore[]>();

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

    return this.http.get<MaterialStore[]>(this.baseUrl + 'KhoVatTu/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingMaterialStore'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'KhoVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailMaterialStore')));
  }

  addNew(materialStore: MaterialStore) {
    return this.http.post(this.baseUrl + 'KhoVatTu', materialStore)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewMaterialStore')));
  }

  update(materialStore: MaterialStore) {
    return this.http.put(this.baseUrl + 'KhoVatTu', materialStore)
      .pipe(catchError(error => this.utility.handleError(error, 'updateMaterialStore')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'KhoVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMaterialStore')));
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'KhoVatTu/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMulitMaterialStore')));
  }
}
