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
import { RoleService } from 'src/app/shared/services/role.service';

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

  keyword = '';
  startValue = '';
  endValue = '';

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: '',
    searchKey: '',
    searchValue: ''
  };

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.roleService.checkPermission('NHAP_VAT_TU', 'Create')
        .subscribe((response: boolean) => {
          if (response) {
            this.router.navigate(['/nghiep-vu/nhap/tao-phieu-nhap']);
          } else {
            this.notify.warning('Bạn không có quyền');
          }
        });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private roleService: RoleService,
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

        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  addNew() {
    this.roleService.checkPermission('NHAP_VAT_TU', 'Create')
      .subscribe((response: boolean) => {
        if (response) {
          this.router.navigate(['/nghiep-vu/nhap/tao-phieu-nhap']);
        } else {
          this.notify.warning('Bạn không có quyền');
          return false;
        }
      });
  }

  update(id: number) {
    this.roleService.checkPermission('NHAP_VAT_TU', 'Update')
      .subscribe((response: boolean) => {
        if (response) {
          this.router.navigate(['/nghiep-vu/nhap/sua-phieu-nhap', id]);
        } else {
          this.notify.warning('Bạn không có quyền');
          return false;
        }
      });
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

  delete(id: number) {
    this.roleService.checkPermission('NHAP_VAT_TU', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
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
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  search() {
    this.pagingParams.keyword = this.keyword;
    this.pagingParams.fromDate = this.startValue;
    this.pagingParams.toDate = this.endValue;
    this.loadData(true);
  }

  refresh() {
    this.startValue = '';
    this.endValue = '';
    this.keyword = '';

    this.pagingParams.keyword = '';
    this.pagingParams.fromDate = '';
    this.pagingParams.toDate = '';
    this.loadData(true);
  }

  searchColumn(searchKey: string) {
    this.pagingParams.searchKey = searchKey;
    this.loadData(true);
  }

  reset() {
    this.pagingParams.searchKey = '';
    this.pagingParams.searchValue = '';
    this.loadData(true);
  }
}
