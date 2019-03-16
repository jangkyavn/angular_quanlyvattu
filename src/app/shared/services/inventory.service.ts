import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { Inventory } from '../models/inventory.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'KhoHang')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllInventory')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Inventory[]>> {
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

    return this.http.get<Inventory[]>(this.baseUrl + 'KhoHang/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingInventory'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'KhoHang/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailInventory')));
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'KhoHang/getTotalCount')
      .pipe(catchError(error => this.utility.handleError(error, 'getTotalCountInventory')));
  }
}
