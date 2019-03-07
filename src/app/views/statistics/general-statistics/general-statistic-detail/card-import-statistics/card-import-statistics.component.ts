import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { PaginatedResult, Pagination } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { Material } from 'src/app/shared/models/material.model';

@Component({
  selector: 'app-card-import-statistics',
  templateUrl: './card-import-statistics.component.html',
  styleUrls: ['./card-import-statistics.component.scss']
})
export class CardImportStatisticsComponent implements OnInit {
  material: Material;
  totalAmount = 0;
  totalQuantity = 0;
  dataSet = [];
  isLoading: boolean;

  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10
  };
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: ''
  };

  constructor(private route: ActivatedRoute,
    private materialService: MaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.material = data['material-statistic-detail'];

      this.route.queryParams.subscribe(params => {
        this.pagingParams.fromDate = params['fromDate'];
        this.pagingParams.toDate = params['toDate'];
        this.loadData();
      });
    });
  }

  sort(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadData();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.isLoading = true;
    this.materialService.getImportDetailsById(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.pagingParams,
      this.material.maVatTu)
      .subscribe((res: PaginatedResult<any>) => {
        this.isLoading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result.items;
        this.totalQuantity = res.result.tongluong;
        this.totalAmount = res.result.tongtien;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingImportDetaislByMaterialId');
      });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
