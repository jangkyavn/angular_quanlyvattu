import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Manufacturer } from '../models/manufacturer.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'HangSanXuat');
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
    }

    return this.http.get<Manufacturer[]>(this.baseUrl + 'HangSanXuat/getAllPaging', { observe: 'response', params })
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
    return this.http.get(this.baseUrl + 'HangSanXuat/' + id);
  }

  addNew(manufacturer: Manufacturer) {
    return this.http.post(this.baseUrl + 'HangSanXuat', manufacturer);
  }

  update(manufacturer: Manufacturer) {
    return this.http.put(this.baseUrl + 'HangSanXuat', manufacturer);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'HangSanXuat/' + id);
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'HangSanXuat/DeleteAllAsync/' + strIds);
  }
}
