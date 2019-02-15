import { Component, OnInit } from '@angular/core';
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

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm hãng sản xuất',
      nzContent: ManufacturerAddEditModalComponent,
      nzMaskClosable: false,
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
            componentInstance.saveChanges((res: boolean) => {
              if (res) {
                this.loadData();
                modal.destroy();
              } else {
                modal.destroy();
              }
            });
          }
        }
      ]
    });
  }

  update(id: number) {
    this.manufacturerService.getDetail(id).subscribe((manufacturer: Manufacturer) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa đơn vị tính',
        nzContent: ManufacturerAddEditModalComponent,
        nzMaskClosable: false,
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
              componentInstance.saveChanges((res: boolean) => {
                if (res) {
                  this.loadData();
                  modal.destroy();
                } else {
                  modal.destroy();
                }
              });
            }
          }
        ]
      });
    });
  }

  delete(id: number) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      this.manufacturerService.delete(id).subscribe((res: boolean) => {
        this.notify.success('Xóa thành công!');
        this.loadData();
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deleteManufacturer');
      });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
