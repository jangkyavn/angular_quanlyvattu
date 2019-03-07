import { Component, OnInit } from '@angular/core';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { StatisticService } from 'src/app/shared/services/statistic.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-general-statistic-list',
  templateUrl: './general-statistic-list.component.html',
  styleUrls: ['./general-statistic-list.component.scss']
})
export class GeneralStatisticListComponent implements OnInit {
  dataSet = [];
  loading: boolean;
  materialStores: MaterialStore[] = [];
  materialItems: MaterialItem[] = [];
  materialTypes: MaterialType[] = [];

  statisticParams: any = {
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    maLoaiVT: '',
    maHM: '',
    maKho: ''
  };
  startValue = '';
  endValue = '';
  storeId = null;
  itemId = null;
  typeId = null;

  constructor(
    private materialStoreService: MaterialStoreService,
    private materialItemService: MaterialItemService,
    private materialTypeService: MaterialTypeService,
    private statisticService: StatisticService,
    private utilities: UtilitiesService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.getAllMaterialStores();
    this.getAllMaterialItems();
    this.getAllMaterialTypes();

    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.statisticService.getGeneralStatistics(this.statisticParams)
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
    this.statisticParams = {
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      maLoaiVT: '',
      maHM: '',
      maKho: ''
    };
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

  collapseMenu() {
    this.utilities.changeCollapsed(true);
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

  refresh() {
    this.storeId = null;
    this.itemId = null;
    this.typeId = null;

    this.initialSearch();
    this.loadData();
  }
}
