import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StatisticService } from 'src/app/shared/services/statistic.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Material } from 'src/app/shared/models/material.model';

import { CardImportStatisticsComponent } from './card-import-statistics/card-import-statistics.component';
import { CardExportStatisticsComponent } from './card-export-statistics/card-export-statistics.component';
import { CardLiquidationStatisticsComponent } from './card-liquidation-statistics/card-liquidation-statistics.component';

@Component({
  selector: 'app-general-statistic-detail',
  templateUrl: './general-statistic-detail.component.html',
  styleUrls: ['./general-statistic-detail.component.scss']
})
export class GeneralStatisticDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('cardImportStatistics') cardImportStatistics: CardImportStatisticsComponent;
  @ViewChild('cardExportStatistics') cardExportStatistics: CardExportStatisticsComponent;
  @ViewChild('cardLiquidationStatistics') cardLiquidationStatistics: CardLiquidationStatisticsComponent;

  material: Material;
  fromDate: string;
  toDate: string;
  tonDauKy: any;
  tonCuoiKy: any;

  constructor(private route: ActivatedRoute,
    private statisticService: StatisticService,
    private utilities: UtilitiesService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['material-statistic-detail'];

      this.route.queryParams.subscribe(params => {
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
        this.tonDauKy = params['tonDauKy'];
        this.tonCuoiKy = params['tonCuoiKy'];
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }

  searchPeriod() {
    if (this.fromDate === '' || this.toDate === '') {
      this.notify.warning('Vui lòng chọn từ ngày đến ngày');
      return;
    }

    const statisticParams = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      maLoaiVT: '',
      maHM: '',
      maKho: '',
      maVatTu: this.material.maVatTu
    };

    this.statisticService.getGeneralStatistics(statisticParams)
      .subscribe((res: any[]) => {
        this.tonDauKy = res[0]['tonDauKy'];
        this.tonCuoiKy = res[0]['tonCuoiKy'];
      });

    this.cardImportStatistics.pagingParams.fromDate = this.fromDate;
    this.cardImportStatistics.pagingParams.toDate = this.toDate;
    this.cardImportStatistics.loadData(true);

    this.cardExportStatistics.pagingParams.fromDate = this.fromDate;
    this.cardExportStatistics.pagingParams.toDate = this.toDate;
    this.cardExportStatistics.loadData(true);

    this.cardLiquidationStatistics.pagingParams.fromDate = this.fromDate;
    this.cardLiquidationStatistics.pagingParams.toDate = this.toDate;
    this.cardLiquidationStatistics.loadData(true);

    if (this.fromDate > this.toDate) {
      this.tonDauKy = '';
      this.tonCuoiKy = '';
    }
  }
}
