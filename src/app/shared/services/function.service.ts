import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Function } from '../models/function.model';
import { PaginatedResult } from '../models/pagination.model';
import { PagingParams } from '../params/paging.param';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'ChucNang');
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Function[]>> {
    const paginatedResult = new PaginatedResult<Function[]>();

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

    return this.http.get<Function[]>(this.baseUrl + 'ChucNang/getAllPaging', { observe: 'response', params })
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
