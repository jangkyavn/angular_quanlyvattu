import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { ExportMaterial } from 'src/app/shared/models/export-material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-export-list',
  templateUrl: './export-list.component.html',
  styleUrls: ['./export-list.component.scss']
})
export class ExportListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: ''
  };

  constructor(
    private route: ActivatedRoute,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['export-materials'].pagination;
      this.dataSet = data['export-materials'].result;
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
    this.loading = true;
    this.exportMaterialService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<ExportMaterial[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingExportMaterial');
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.exportMaterialService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.loadData();
          this.notify.success('Xóa thành công');
        }
      }, error => {
        console.log('error deleteExportMaterial');
      });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
