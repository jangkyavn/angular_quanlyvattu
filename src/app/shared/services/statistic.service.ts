import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ImportStatistic } from '../models/import-statistic.model';
import { ExportStatistic } from '../models/export-statistic.model';
import { LiquidationStatistic } from '../models/liquidation-statistic.model';
import { GeneralStatistic } from '../models/general-statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getImportStatistics(statisticParams?: any): Observable<ImportStatistic[]> {

    let params = new HttpParams();

    if (statisticParams != null) {
      params = params.append('fromDate', statisticParams.fromDate);
      params = params.append('toDate', statisticParams.toDate);
      params = params.append('maLoaiVT', statisticParams.maLoaiVT);
      params = params.append('maHM', statisticParams.maHM);
      params = params.append('maKho', statisticParams.maKho);
    }

    return this.http.get<ImportStatistic[]>(this.baseUrl + 'ThongKeBaoCao/ThongKeNhap', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getExportStatistics(statisticParams?: any): Observable<ExportStatistic[]> {

    let params = new HttpParams();

    if (statisticParams != null) {
      params = params.append('fromDate', statisticParams.fromDate);
      params = params.append('toDate', statisticParams.toDate);
      params = params.append('maLoaiVT', statisticParams.maLoaiVT);
      params = params.append('maHM', statisticParams.maHM);
      params = params.append('maKho', statisticParams.maKho);
    }

    return this.http.get<ExportStatistic[]>(this.baseUrl + 'ThongKeBaoCao/ThongKeXuat', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getLiquidationStatistics(statisticParams?: any): Observable<LiquidationStatistic[]> {

    let params = new HttpParams();

    if (statisticParams != null) {
      params = params.append('fromDate', statisticParams.fromDate);
      params = params.append('toDate', statisticParams.toDate);
      params = params.append('maLoaiVT', statisticParams.maLoaiVT);
      params = params.append('maHM', statisticParams.maHM);
      params = params.append('maKho', statisticParams.maKho);
    }

    return this.http.get<LiquidationStatistic[]>(this.baseUrl + 'ThongKeBaoCao/ThongKeThanhLy', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getGeneralStatistics(statisticParams?: any): Observable<GeneralStatistic[]> {

    let params = new HttpParams();

    if (statisticParams != null) {
      params = params.append('fromDate', statisticParams.fromDate);
      params = params.append('toDate', statisticParams.toDate);
      params = params.append('maLoaiVT', statisticParams.maLoaiVT);
      params = params.append('maHM', statisticParams.maHM);
      params = params.append('maKho', statisticParams.maKho);
    }

    return this.http.get<GeneralStatistic[]>(this.baseUrl + 'ThongKeBaoCao/ThongKeNhapXuatTon', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }
}
