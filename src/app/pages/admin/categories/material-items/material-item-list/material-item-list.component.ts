import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialItemAddEditModalComponent } from '../material-item-add-edit-modal/material-item-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-material-item-list',
  templateUrl: './material-item-list.component.html',
  styleUrls: ['./material-item-list.component.scss']
})
export class MaterialItemListComponent implements OnInit {
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
    private materialItemService: MaterialItemService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['material-items'].pagination;
      this.dataSet = data['material-items'].result;
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
    this.materialItemService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<MaterialItem[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingMaterialItem');
      });
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm hạng mục vật tư',
      nzContent: MaterialItemAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        materialItem: {},
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
    this.materialItemService.getDetail(id).subscribe((materialItem: MaterialItem) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa hạng mục vật tư',
        nzContent: MaterialItemAddEditModalComponent,
        nzMaskClosable: false,
        nzComponentParams: {
          materialItem,
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
      /////////////
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
