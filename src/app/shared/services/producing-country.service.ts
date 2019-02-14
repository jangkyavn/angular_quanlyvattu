import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProducingCountry } from '../models/producing-country.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProducingCountryService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'NuocSanXuat');
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
        })
      );
  }

  getDetail(id: number) {
    return this.http.get(this.baseUrl + 'NuocSanXuat/' + id);
  }

  addNew(producingCountry: ProducingCountry) {
    return this.http.post(this.baseUrl + 'NuocSanXuat', producingCountry);
  }

  update(producingCountry: ProducingCountry) {
    return this.http.put(this.baseUrl + 'NuocSanXuat', producingCountry);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'NuocSanXuat/' + id);
  }
}
