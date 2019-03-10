import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UtilitiesService } from './utilities.service';

import { Material } from '../models/material.model';
import { PagingParams } from '../params/paging.param';
import { PaginatedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
    private utility: UtilitiesService) { }

  getAll() {
    return this.http.get(this.baseUrl + 'VatTu')
      .pipe(catchError(error => this.utility.handleError(error, 'getAllMaterial')));
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
        }),
        catchError(error => this.utility.handleError(error, 'getAllPagingMaterial'))
      );
  }

  getAllPagingSearch(page?: any, itemsPerPage?: any, pagingParams?: PagingParams): Observable<PaginatedResult<Material[]>> {
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

    return this.http.get<Material[]>(this.baseUrl + 'VatTu/getAllPagingWithTongTon', { observe: 'response', params })
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
    return this.http.get(this.baseUrl + 'VatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'getDetailMaterial')));
  }

  getTotalCount() {
    return this.http.get(this.baseUrl + 'VatTu/getTotalCount')
      .pipe(catchError(error => this.utility.handleError(error, 'getTotalCountMaterial')));
  }

  getAllByItemId(materialItemId: number) {
    return this.http.get(this.baseUrl + 'VatTu/GetByMaHM/' + materialItemId)
      .pipe(catchError(error => this.utility.handleError(error, 'getAllByItemIdMaterial')));
  }

  addNew(material: Material) {
    return this.http.post(this.baseUrl + 'VatTu', material)
      .pipe(catchError(error => this.utility.handleError(error, 'addNewMaterial')));
  }

  update(material: Material) {
    return this.http.put(this.baseUrl + 'VatTu', material)
      .pipe(catchError(error => this.utility.handleError(error, 'updateMaterial')));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'VatTu/' + id)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMaterial')));
  }

  deleteMulti(strIds: string) {
    return this.http.delete(this.baseUrl + 'VatTu/DeleteAllAsync/' + strIds)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteMultiMaterial')));
  }

  importExcel(data: any) {
    return this.http.post(this.baseUrl + 'VatTu/ImportVT', data)
      .pipe(catchError(error => this.utility.handleError(error, 'importExcelMaterial')));
  }

  exportExcel(data: any) {
    return this.http.post(this.baseUrl + 'VatTu/ExportVT', data)
      .pipe(catchError(error => this.utility.handleError(error, 'exportExcelMaterial')));
  }

  deleteExportFile(fileName: string) {
    return this.http.get(this.baseUrl + 'VatTu/DeleteFileVTAfterExport/' + fileName)
      .pipe(catchError(error => this.utility.handleError(error, 'deleteExportFileMaterial')));
  }

  getImportDetailsById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any>> {
    const paginatedResult = new PaginatedResult<any>();

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

    if (pagingParams.fromDate !== '' && pagingParams.toDate !== '') {
      params = params.append('fromDate', pagingParams.fromDate);
      params = params.append('toDate', pagingParams.toDate);
    }

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any>(this.baseUrl + 'VatTu/ThongKeVatTuNhapByMaVT', { observe: 'response', params })
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

  getExportDetailsById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any>> {
    const paginatedResult = new PaginatedResult<any>();

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

    if (pagingParams.fromDate !== '' && pagingParams.toDate !== '') {
      params = params.append('fromDate', pagingParams.fromDate);
      params = params.append('toDate', pagingParams.toDate);
    }

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any>(this.baseUrl + 'VatTu/ThongKeVatTuXuatpByMaVT', { observe: 'response', params })
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

  getInventoriesById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any>> {
    const paginatedResult = new PaginatedResult<any>();

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

    return this.http.get<any>(this.baseUrl + 'VatTu/ThongKeVatTuTonKhoByMaVT', { observe: 'response', params })
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

  getLiquidationsById(page?: any, itemsPerPage?: any, pagingParams?: PagingParams, id?: any): Observable<PaginatedResult<any>> {
    const paginatedResult = new PaginatedResult<any>();

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

    if (pagingParams.fromDate !== '' && pagingParams.toDate !== '') {
      params = params.append('fromDate', pagingParams.fromDate);
      params = params.append('toDate', pagingParams.toDate);
    }

    if (id != null) {
      params = params.append('id', id);
    }

    return this.http.get<any>(this.baseUrl + 'VatTu/ThongKeVatTuThanhLyByMaVT', { observe: 'response', params })
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
