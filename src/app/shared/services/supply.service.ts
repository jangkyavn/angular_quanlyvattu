import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Supply } from '../models/supply.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';
import { UtilitiesService } from './utilities.service';

@Injectable({
  providedIn: 'root'
})
export class SupplyService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NguonCungCap')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllSupply')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Supply[]>> {
    const paginatedResult = new PaginatedResult<Supply[]>();

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

    return this.http.get<Supply[]>(this.baseUrl + 'NguonCungCap/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingSupply'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NguonCungCap/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailSupply')));
  }

  addNew(supply: Supply) {
    return this.http.post(this.baseUrl + 'NguonCungCap', supply)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewSupply')));
  }

  update(supply: Supply) {
    return this.http.put(this.baseUrl + 'NguonCungCap', supply)
      .pipe(catchError(error => this.utility.handleError(error, 'updateSupply')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'NguonCungCap/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteSupply')));
  }

  deleteMulti(strIds: any) {
    return this.http.delete(this.baseUrl + 'NguonCungCap/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMulitSupply')));
  }
}
