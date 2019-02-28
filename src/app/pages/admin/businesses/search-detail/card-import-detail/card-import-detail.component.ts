import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-card-import-detail',
  templateUrl: './card-import-detail.component.html',
  styleUrls: ['./card-import-detail.component.scss']
})
export class CardImportDetailComponent implements OnInit {
  dataSet = [];
  isLoading: boolean;
  materialId: any;
  totalAmountAfterDiscount: any;

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

    this.materialService.getImportDetailsById(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams, this.materialId)
      .subscribe((res: PaginatedResult<any[]>) => {
        this.isLoading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
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