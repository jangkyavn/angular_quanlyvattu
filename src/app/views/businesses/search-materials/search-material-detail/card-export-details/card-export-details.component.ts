import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-card-export-details',
  templateUrl: './card-export-details.component.html',
  styleUrls: ['./card-export-details.component.scss']
})
export class CardExportDetailsComponent implements OnInit {
  dataSet = [];
  isLoading: boolean;
  materialId: any;
  totalAmount = 0;
  totalQuantity = 0;

  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5
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
    this.isLoading = true;
    this.route.params.subscribe(data => {
      this.materialId = data['id'];
      this.loadData();
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

    this.materialService.getExportDetailsById(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams, this.materialId)
      .subscribe((res: PaginatedResult<any>) => {
        this.isLoading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result.items;
        this.totalQuantity = res.result.tongluong;
        this.totalAmount = res.result.tongtien;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingExportDetaislByMaterialId');
      });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
