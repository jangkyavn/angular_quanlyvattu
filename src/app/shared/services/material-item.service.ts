import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { MaterialItem } from '../models/material-item.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialItemService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'HangMucVatTu')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllMaterialItem')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<MaterialItem[]>> {
    const paginatedResult = new PaginatedResult<MaterialItem[]>();

    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (pagingParams != null) {
      params = params.append('keyword', pagingParams.keyword);
      params = params.append('sortKey', pagingParams.sortKey);
      params = params.append('sortValue', pagingParams.sortValue);
      params = params.append('searchKey', pagingParams.searchKey);
      params = params.append('searchValue', pagingParams.searchValue);
    }

    return this.http.get<MaterialItem[]>(this.baseUrl + 'HangMucVatTu/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingMaterialItem'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'HangMucVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailMaterialItem')));
  }

  addNew(materialItem: MaterialItem) {
    return this.http.post(this.baseUrl + 'HangMucVatTu', materialItem)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewMaterialItem')));
  }

  update(materialItem: MaterialItem) {
    return this.http.put(this.baseUrl + 'HangMucVatTu', materialItem)
      .pipe(catchError(error => this.utility.handleError(error, 'updateMaterialItem')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'HangMucVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMaterialItem')));
  }
}
