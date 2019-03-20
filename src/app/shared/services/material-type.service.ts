import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { MaterialType } from '../models/material-type.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'LoaiVatTu')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllMaterialType')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<MaterialType[]>> {
    const paginatedResult = new PaginatedResult<MaterialType[]>();

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

    return this.http.get<MaterialType[]>(this.baseUrl + 'LoaiVatTu/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingMaterialType'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'LoaiVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailMaterialType')));
  }

  getAllByItemId(itemId: number) {
    return this.http.get(this.baseUrl + 'LoaiVatTu/getListLoaiByMaHM/' + itemId)
      .pipe(catchError(error => this.utility.handleError(error, 'getAllByItemIdMaterialType')));
  }

  addNew(materialType: MaterialType) {
    return this.http.post(this.baseUrl + 'LoaiVatTu', materialType)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewMaterialType')));
  }

  update(materialType: MaterialType) {
    return this.http.put(this.baseUrl + 'LoaiVatTu', materialType)
      .pipe(catchError(error => this.utility.handleError(error, 'updateMaterialType')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'LoaiVatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMaterialType')));
  }
}
