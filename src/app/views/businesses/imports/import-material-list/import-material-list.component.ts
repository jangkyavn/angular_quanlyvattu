import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { ImportMaterial } from 'src/app/shared/models/import-material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import {
  ImportMaterialViewDetailModalComponent
} from '../modals/import-material-view-detail-modal/import-material-view-detail-modal.component';

@Component({
  selector: 'app-import-material-list',
  templateUrl: './import-material-list.component.html',
  styleUrls: ['./import-material-list.component.scss']
})
export class ImportMaterialListComponent implements OnInit {
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

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.router.navigate(['/nghiep-vu/nhap/tao-phieu-nhap']);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private importMaterialService: ImportMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['import-material-list'].pagination;
      this.dataSet = data['import-material-list'].result;
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
    this.importMaterialService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<ImportMaterial[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingImportMaterial');
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.importMaterialService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.loadData();
          this.notify.success('Xóa thành công');
        } else {
          this.notify.warning('Phiếu có vật tư xuất, không được xóa!');
        }
      }, error => {
        console.log('error deleteImport');
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
    this.importMaterialService.getDetail(id).subscribe((res: any) => {
      const modal = this.modalService.create({
        nzTitle: 'Xem phiếu nhập',
        nzContent: ImportMaterialViewDetailModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzWidth: 1200,
        nzComponentParams: {
          importMaterialParams: res
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
