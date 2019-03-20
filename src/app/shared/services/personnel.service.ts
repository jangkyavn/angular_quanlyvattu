import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { Personnel } from '../models/personnel.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NhanSu')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllPersonnel')));
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Personnel[]>> {
    const paginatedResult = new PaginatedResult<Personnel[]>();

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

    return this.http.get<Personnel[]>(this.baseUrl + 'NhanSu/getAllPaging', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingPersonnel'))
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NhanSu/' + id)
    .pipe(catchError(error => this.utility.handleError(error, 'getDetailPersonnel')));
  }

  addNew(personnel: Personnel) {
    return this.http.post(this.baseUrl + 'NhanSu', personnel)
    .pipe(catchError(error => this.utility.handleError(error, 'addNewPersonnel')));
  }

  update(personnel: Personnel) {
    return this.http.put(this.baseUrl + 'NhanSu', personnel)
    .pipe(catchError(error => this.utility.handleError(error, 'updatePersonnel')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'NhanSu/' + id)
    .pipe(catchError(error => this.utility.handleError(error, 'deletePersonnel')));
  }

  getCities() {
    return this.http.get(this.baseUrl + 'NhanSu/LoadCities');
  }

  getDistrict(cityId: any) {
    return this.http.get(this.baseUrl + 'NhanSu/loadDistricts/' + cityId);
  }

  getNations() {
    return this.http.get(this.baseUrl + 'NhanSu/loadNations');
  }
}
