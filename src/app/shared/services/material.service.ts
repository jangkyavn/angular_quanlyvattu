import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material } from '../models/material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.baseUrl + 'VatTu');
  }

  getAllPaging(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Material[]>> {
    const paginatedResult = new PaginatedResult<Material[]>();

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

    return this.http.get<Material[]>(this.baseUrl + 'VatTu/getAllPaging', { observe: 'response', params })
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
    return this.http.get(this.baseUrl + 'VatTu/' + id);
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'VatTu/getTotalCount');
  }

  getAllByItemId(materialItemId: number) {
    return this.http.get(this.baseUrl + 'VatTu/GetByMaHM/' + materialItemId);
  }

  addNew(material: Material) {
    return this.http.post(this.baseUrl + 'VatTu', material);
  }

  update(material: Material) {
    return this.http.put(this.baseUrl + 'VatTu', material);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'VatTu/' + id);
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'VatTu/DeleteAllAsync/' + strIds);
  }

  importExcel(data: any) {
    return this.http.post(this.baseUrl + 'VatTu/ImportVT', data);
  }

  exportExcel(data: any) {
    return this.http.post(this.baseUrl + 'VatTu/ExportVT', data);
  }

  deleteExportFile(fileName: string) {
    return this.http.get(this.baseUrl + 'VatTu/DeleteFileVTAfterExport/' + fileName);
  }


  getImportDetailsById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any[]>> {
    const paginatedResult = new PaginatedResult<any[]>();

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

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any[]>(this.baseUrl + 'VatTu/ThongKeVatTuNhapByMaVT', { observe: 'response', params })
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

  getExportDetailsById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any[]>> {
    const paginatedResult = new PaginatedResult<any[]>();

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

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any[]>(this.baseUrl + 'VatTu/ThongKeVatTuXuatpByMaVT', { observe: 'response', params })
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

  getInventoriesById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any[]>> {
    const paginatedResult = new PaginatedResult<any[]>();

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

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any[]>(this.baseUrl + 'VatTu/ThongKeVatTuTonKhoByMaVT', { observe: 'response', params })
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
