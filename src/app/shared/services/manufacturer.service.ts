import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { Manufacturer } from '../models/manufacturer.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'HangSanXuat')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllManufacturer')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Manufacturer[]>> {
    const paginatedResult = new PaginatedResult<Manufacturer[]>();

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

    return this.http.get<Manufacturer[]>(this.baseUrl + 'HangSanXuat/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingManufacturer'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'HangSanXuat/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailManufacturer')));
  }

  addNew(manufacturer: Manufacturer) {
    return this.http.post(this.baseUrl + 'HangSanXuat', manufacturer)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewManufacturer')));
  }

  update(manufacturer: Manufacturer) {
    return this.http.put(this.baseUrl + 'HangSanXuat', manufacturer)
      .pipe(catchError(error => this.utility.handleError(error, 'updateManufacturer')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'HangSanXuat/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteManufacturer')));
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'HangSanXuat/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMultiManufacturer')));
  }
}
