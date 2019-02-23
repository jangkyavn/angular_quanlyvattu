import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { NzModalService } from 'ng-zorro-antd';

import { ExportMaterial } from 'src/app/shared/models/export-material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { ExportViewDetailModalComponent } from '../export-view-detail-modal/export-view-detail-modal.component';

@Component({
  selector: 'app-export-list',
  templateUrl: './export-list.component.html',
  styleUrls: ['./export-list.component.scss']
})
export class ExportListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = '';
  sortKey = '';

  startValue = '';
  endValue = '';
  disabledButtonSearch = true;

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
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
    this.pagingParams.fromDate = this.startValue;
    this.pagingParams.toDate = this.endValue;

    this.loadData(true);
  }

  view(id: number) {
    this.exportMaterialService.getDetail(id).subscribe((res: any) => {
      const modal = this.modalService.create({
        nzTitle: 'Xem phiếu xuất',
        nzContent: ExportViewDetailModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: 1000,
        nzComponentParams: {
          exportMaterialParams: res
        },
        nzFooter: [
          {
            label: 'Hủy',
            shape: 'default',
            onClick: () => modal.destroy()
          }
        ]
      });
    });
  }

  enableButtonSearch() {
    if (this.startValue > this.endValue) {
      return true;
    }

    return !(this.startValue && this.endValue);
  }

  changeFromDate(value: any) {
    this.startValue = value;

    if (this.endValue === null || this.endValue === '') {
      this.endValue = this.startValue;
    }

    this.disabledButtonSearch = this.enableButtonSearch();

    if ((this.startValue === '' && this.endValue === '') || (this.startValue === null && this.endValue) === '') {
      this.search(this.pagingParams.keyword);
    }
  }

  changeToDate(value: any) {
    this.endValue = value;
    this.disabledButtonSearch = this.enableButtonSearch();

    if ((this.startValue === '' && this.endValue === '') || (this.startValue === null && this.endValue) === '') {
      this.search(this.pagingParams.keyword);
    }
  }
}
