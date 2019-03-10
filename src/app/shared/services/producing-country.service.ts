import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { ProducingCountry } from '../models/producing-country.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProducingCountryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NuocSanXuat')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllProducingCountry')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<ProducingCountry[]>> {
    const paginatedResult = new PaginatedResult<ProducingCountry[]>();

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

    return this.http.get<ProducingCountry[]>(this.baseUrl + 'NuocSanXuat/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingProducingCountry'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NuocSanXuat/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailProducingCountry')));
  }

  addNew(producingCountry: ProducingCountry) {
    return this.http.post(this.baseUrl + 'NuocSanXuat', producingCountry)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewProducingCountry')));
  }

  update(producingCountry: ProducingCountry) {
    return this.http.put(this.baseUrl + 'NuocSanXuat', producingCountry)
      .pipe(catchError(error => this.utility.handleError(error, 'updateProducingCountry')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'NuocSanXuat/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteProducingCountry')));
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'NuocSanXuat/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMultiProducingCountry')));
  }
}
