import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerAddEditModalComponent } from '../manufacturer-add-edit-modal/manufacturer-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.scss']
})
export class ManufacturerListComponent implements OnInit {
  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  displayData: Array<Manufacturer> = [];
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
    private manufacturerService: ManufacturerService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['manufacturers'].pagination;
      this.dataSet = data['manufacturers'].result;
    });
  }

  currentPageDataChange($event: Array<Manufacturer>): void {
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
    this.manufacturerService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Manufacturer[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;

        this.indeterminate = false;
        this.allChecked = false;
        this.checkedNumber = 0;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingManufacturer');
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
      nzTitle: 'Thêm hãng sản xuất',
      nzContent: ManufacturerAddEditModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        manufacturer: {},
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
  }

  update(id: number) {
    this.manufacturerService.getDetail(id).subscribe((manufacturer: Manufacturer) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa đơn vị tính',
        nzContent: ManufacturerAddEditModalComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzComponentParams: {
          manufacturer,
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
      this.manufacturerService.delete(id).subscribe((res: boolean) => {
        if (res) {
          this.notify.success('Xóa thành công!');
          this.loadData();
        } else {
          this.notify.warning('Tên hãng sx đang được sử dụng. Không được xóa!');
        }
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deleteManufacturer');
      });
    });
  }

  deleteMulti() {
    const ids = this.displayData.filter(value => value.checked).map((value: Manufacturer) => value.maHang);

    this.notify.confirm(`Bạn có chắc chắn muốn xóa ${this.checkedNumber} không?`, () => {
      this.manufacturerService.deleteMulti(JSON.stringify(ids))
        .subscribe((res: boolean) => {
          if (res) {
            this.notify.success('Xóa thành công');
            this.loadData();
          } else {
            this.notify.warning('Có tên hãng đã được sử dụng. Không được xóa!');
          }
        }, _ => {
          this.notify.error('Có lỗi xảy ra');
          console.log('error deleteMultiManufacturer');
        });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
