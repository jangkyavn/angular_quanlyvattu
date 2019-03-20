import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UtilitiesService } from './utilities.service';

import { environment } from 'src/environments/environment';
import { Unit } from '../models/unit.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'DonViTinh')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllUnit')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Unit[]>> {
    const paginatedResult = new PaginatedResult<Unit[]>();

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

    return this.http.get<Unit[]>(this.baseUrl + 'DonViTinh/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingUnit'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'DonViTinh/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailUnit')));
  }

  addNew(unit: Unit) {
    return this.http.post(this.baseUrl + 'DonViTinh', unit)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewUnit')));
  }

  update(unit: Unit) {
    return this.http.put(this.baseUrl + 'DonViTinh', unit)
      .pipe(catchError(error => this.utility.handleError(error, 'updateUnit')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'DonViTinh/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteUnit')));
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'DonViTinh/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMultiUnit')));
  }
}
