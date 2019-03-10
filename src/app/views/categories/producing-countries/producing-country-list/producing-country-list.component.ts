import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { RoleService } from 'src/app/shared/services/role.service';
import { ProducingCountryService } from 'src/app/shared/services/producing-country.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { ProducingCountry } from 'src/app/shared/models/producing-country.model';
import {
  ProducingCountryAddEditModalComponent
} from '../modals/producing-country-add-edit-modal/producing-country-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-producing-country-list',
  templateUrl: './producing-country-list.component.html',
  styleUrls: ['./producing-country-list.component.scss']
})
export class ProducingCountryListComponent implements OnInit {
  allChecked = false;
  checkedNumber = 0;
  displayData: Array<ProducingCountry> = [];
  indeterminate = false;

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

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.addNew();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private roleService: RoleService,
    private producingCountryService: ProducingCountryService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['producing-country-list'].pagination;
      this.dataSet = data['producing-country-list'].result;
    });
  }

  currentPageDataChange($event: Array<ProducingCountry>): void {
    this.displayData = $event;
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
    this.producingCountryService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<ProducingCountry[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;

        this.indeterminate = false;
        this.allChecked = false;
        this.checkedNumber = 0;

        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.checkedNumber = this.dataSet.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  addNew() {
    this.roleService.checkPermission('NUOC_SAN_XUAT', 'Create')
      .subscribe((response: boolean) => {
        if (response) {
          const modal = this.modalService.create({
            nzTitle: 'Thêm nước sản xuất',
            nzContent: ProducingCountryAddEditModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
            nzComponentParams: {
              producingCountry: {},
              isAddNew: true
            },
            nzFooter: [
              {
                label: 'Hủy',
                shape: 'default',
                onClick: () => modal.destroy(),
              },
              {
                label: 'Lưu',
                type: 'primary',
                onClick: (componentInstance) => {
                  componentInstance.saveChanges();
                }
              }
            ]
          });

          modal.afterClose.subscribe((result: boolean) => {
            if (result) {
              this.loadData();
            }
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  update(id: number) {
    this.roleService.checkPermission('NUOC_SAN_XUAT', 'Update')
      .subscribe((response: boolean) => {
        if (response) {
          this.producingCountryService.getDetail(id).subscribe((producingCountry: ProducingCountry) => {
            const modal = this.modalService.create({
              nzTitle: 'Sửa nước sản xuất',
              nzContent: ProducingCountryAddEditModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
              nzComponentParams: {
                producingCountry,
                isAddNew: false
              },
              nzFooter: [
                {
                  label: 'Hủy',
                  shape: 'default',
                  onClick: () => modal.destroy()
                },
                {
                  label: 'Lưu',
                  type: 'primary',
                  onClick: (componentInstance) => {
                    componentInstance.saveChanges();
                  }
                }
              ]
            });

            modal.afterClose.subscribe((result: boolean) => {
              if (result) {
                this.loadData();
              }
            });
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  delete(id: number) {
    this.roleService.checkPermission('NUOC_SAN_XUAT', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
            this.producingCountryService.delete(id).subscribe((res: boolean) => {
              if (res) {
                this.notify.success('Xóa thành công!');
                this.loadData();
              } else {
                this.notify.warning('Tên nước sx đang được sử dụng. Không được xóa!');
              }
            });
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  deleteMulti() {
    this.roleService.checkPermission('NUOC_SAN_XUAT', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          const ids = this.displayData.filter(value => value.checked).map((value: ProducingCountry) => value.maNuoc);
          this.notify.confirm(`Bạn có chắc chắn muốn xóa ${this.checkedNumber} không?`, () => {
            this.producingCountryService.deleteMulti(JSON.stringify(ids))
              .subscribe((res: boolean) => {
                if (res) {
                  this.notify.success('Xóa thành công');
                  this.loadData();
                } else {
                  this.notify.warning('Có tên nước đã được sử dụng. Không được xóa!');
                }
              });
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
