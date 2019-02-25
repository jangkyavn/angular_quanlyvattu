import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { UnitService } from 'src/app/shared/services/unit.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Unit } from 'src/app/shared/models/unit.model';
import { UnitAddEditModalComponent } from '../unit-add-edit-modal/unit-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  displayData: Array<Unit> = [];
  operating = false;
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
    private unitService: UnitService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['units'].pagination;
      this.dataSet = data['units'].result;
    });
  }

  currentPageDataChange($event: Array<Unit>): void {
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
    this.unitService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Unit[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;

        this.indeterminate = false;
        this.allChecked = false;
        this.checkedNumber = 0;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingUnits');
      }, () => {
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
    this.disabledButton = !this.dataSet.some(value => value.checked);
    this.checkedNumber = this.dataSet.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm đơn vị tính',
      nzContent: UnitAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        unit: {},
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
        modal.destroy();
      } else {
        modal.destroy();
      }
    });
  }

  update(id: number) {
    this.unitService.getDetail(id).subscribe((unit: Unit) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa đơn vị tính',
        nzContent: UnitAddEditModalComponent,
        nzMaskClosable: false,
        nzComponentParams: {
          unit,
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
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.unitService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.notify.success('Xóa thành công!');
          this.loadData();
        } else {
          this.notify.warning('Đơn vị tính đang được sử dụng. Không được xóa!');
        }
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deleteUnit');
      });
    });
  }

  deleteMulti() {
    const ids = this.displayData.filter(value => value.checked).map((value: Unit) => value.maDVT);

    this.notify.confirm(`Bạn có chắc chắn muốn xóa ${this.checkedNumber} không?`, () => {
      this.unitService.deleteMulti(JSON.stringify(ids))
        .subscribe((res: boolean) => {
          if (res) {
            this.notify.success('Xóa thành công');
            this.loadData();
          } else {
            this.notify.warning('Có tên đơn vị đã được sử dụng. Không được xóa!');
          }
        }, _ => {
          this.notify.error('Có lỗi xảy ra');
          console.log('error deleteMultiUnit');
        });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
