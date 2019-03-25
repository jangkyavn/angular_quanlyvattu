import { Component, OnInit } from '@angular/core';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { StatisticService } from 'src/app/shared/services/statistic.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-liquidation-statistic-list',
  templateUrl: './liquidation-statistic-list.component.html',
  styleUrls: ['./liquidation-statistic-list.component.scss']
})
export class LiquidationStatisticListComponent implements OnInit {
  dataSet = [];
  loading: boolean;
  materialStores: MaterialStore[] = [];
  materialItems: MaterialItem[] = [];
  materialTypes: MaterialType[] = [];

  statisticParams: any = {
    sortKey: '',
    sortValue: ''
  };
  startValue = '';
  endValue = '';
  storeId = null;
  itemId = null;
  typeId = null;
  searchKey: any;
  searchValue: any;

  constructor(
    private route: ActivatedRoute,
    private materialStoreService: MaterialStoreService,
    private materialItemService: MaterialItemService,
    private materialTypeService: MaterialTypeService,
    private statisticService: StatisticService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.statisticParams = this.initialRangeDate();

    this.getAllMaterialStores();
    this.getAllMaterialItems();
    this.getAllMaterialTypes();

    this.route.data.subscribe(data => {
      this.dataSet = data['liquidation-statistic-list'];
      this.loading = false;
    });
  }

  sort(sort: { key: string, value: string }): void {
    this.statisticParams.sortKey = sort.key;
    this.statisticParams.sortValue = sort.value;
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.statisticService.getLiquidationStatistics(this.statisticParams)
      .subscribe((res: any[]) => {
        this.dataSet = res;
        this.loading = false;
      });
  }

  getAllMaterialStores() {
    this.materialStoreService.getAll().subscribe((res: any[]) => {
      this.materialStores = res;
    });
  }

  getAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: any[]) => {
      this.materialItems = res;
    });
  }

  getAllMaterialTypes() {
    this.materialTypeService.getAll().subscribe((res: any[]) => {
      this.materialTypes = res;
    });
  }

  initialSearch() {
    this.statisticParams = this.initialRangeDate();
  }

  search() {
    if (this.statisticParams.fromDate === '' || this.statisticParams.toDate === '') {
      this.notify.warning('Vui lòng chọn từ ngày đến ngày');
      return;
    }

    this.statisticParams.maLoaiVT = this.statisticParams.maLoaiVT || '';
    this.statisticParams.maHM = this.statisticParams.maHM || '';
    this.statisticParams.maKho = this.statisticParams.maKho || '';

    this.loadData();
  }

  changeMaterialStores(event: any) {
    this.statisticParams.maKho = event;
  }

  changeMaterialItems(event: any) {
    this.statisticParams.maHM = event;
  }

  changeMaterialTypes(event: any) {
    this.statisticParams.maLoaiVT = event;
  }

  initialRangeDate() {
    const curr = new Date;
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;

    const firstday = new Date(curr.setDate(first)).toISOString().split('T')[0];
    const lastday = new Date(curr.setDate(last)).toISOString().split('T')[0];

    return {
      fromDate: firstday,
      toDate: lastday,
      maLoaiVT: '',
      maHM: '',
      maKho: ''
    };
  }

  refresh() {
    this.storeId = null;
    this.itemId = null;
    this.typeId = null;

    this.initialSearch();
    this.loadData();
  }

  searchColumn(searchKey: string) {
    this.statisticParams.searchValue = this.searchValue;
    this.statisticParams.searchKey = searchKey;
    this.loadData();
  }

  reset() {
    this.statisticParams.searchKey = '';
    this.statisticParams.searchValue = '';
    this.loadData();
  }
}
