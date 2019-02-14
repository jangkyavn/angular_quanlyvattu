import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MaterialType } from '../models/material-type.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialTypeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'LoaiVatTu');
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
    }

    return this.http.get<MaterialType[]>(this.baseUrl + 'LoaiVatTu/getAllPaging', { observe: 'response', params })
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
    return this.http.get(this.baseUrl + 'LoaiVatTu/' + id);
  }

  getAllByItemId(itemId: number) {
    return this.http.get(this.baseUrl + 'LoaiVatTu/getListLoaiByMaHM/' + itemId);
  }

  addNew(materialType: MaterialType) {
    return this.http.post(this.baseUrl + 'LoaiVatTu', materialType);
  }

  update(materialType: MaterialType) {
    return this.http.put(this.baseUrl + 'LoaiVatTu', materialType);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'LoaiVatTu/' + id);
  }
}
