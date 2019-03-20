import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { SupplyService } from 'src/app/shared/services/supply.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyAddEditModalComponent } from '../modals/supply-add-edit-modal/supply-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-supply-list',
  templateUrl: './supply-list.component.html',
  styleUrls: ['./supply-list.component.scss']
})
export class SupplyListComponent implements OnInit {
  allChecked = false;
  checkedNumber = 0;
  displayData: Array<Supply> = [];
  indeterminate = false;

  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    searchKey: '',
    searchValue: ''
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
    private supplyService: SupplyService,
    private roleService: RoleService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['supply-list'].pagination;
      this.dataSet = data['supply-list'].result;
    });
  }

  currentPageDataChange($event: Array<Supply>): void {
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
    this.supplyService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Supply[]>) => {
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
    this.roleService.checkPermission('NGUON_CUNG_CAP', 'Create').subscribe((response: boolean) => {
      if (response) {
        const modal = this.modalService.create({
          nzTitle: 'Thêm nguồn cung cấp',
          nzContent: SupplyAddEditModalComponent,
          nzMaskClosable: false,
          nzComponentParams: {
            supply: {},
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
    this.roleService.checkPermission('NGUON_CUNG_CAP', 'Update').subscribe((res: boolean) => {
      if (res) {
        this.supplyService.getDetail(id).subscribe((supply: Supply) => {
          const modal = this.modalService.create({
            nzTitle: 'Sửa nguồn cung cấp',
            nzContent: SupplyAddEditModalComponent,
            nzMaskClosable: false,
            nzComponentParams: {
              supply,
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
    this.roleService.checkPermission('NGUON_CUNG_CAP', 'Delete').subscribe((response: boolean) => {
      if (response) {
        this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
          this.supplyService.delete(id).subscribe((res: boolean) => {
            if (res) {
              this.notify.success('Xóa thành công!');
              this.loadData();
            } else {
              this.notify.warning('Tên nguồn cung cấp đang được sử dụng. Không được xóa!');
            }
          });
        });
      } else {
        this.notify.warning('Bạn không có quyền');
      }
    });
  }

  deleteMulti() {
    this.roleService.checkPermission('NGUON_CUNG_CAP', 'Delete').subscribe((response: boolean) => {
      if (response) {
        const ids = this.displayData.filter(value => value.checked).map((value: Supply) => value.maNguon);
        this.notify.confirm(`Bạn có chắc chắn muốn xóa ${this.checkedNumber} không?`, () => {
          this.supplyService.deleteMulti(JSON.stringify(ids))
            .subscribe((res: boolean) => {
              if (res) {
                this.notify.success('Xóa thành công');
                this.loadData();
              } else {
                this.notify.warning('Có tên nguồn đã được sử dụng. Không được xóa!');
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
