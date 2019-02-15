import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialType } from 'src/app/shared/models/material-type.model';
import { MaterialTypeAddEditModalComponent } from '../material-type-add-edit-modal/material-type-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-material-type-list',
  templateUrl: './material-type-list.component.html',
  styleUrls: ['./material-type-list.component.scss']
})
export class MaterialTypeListComponent implements OnInit {
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
    private materialTypeService: MaterialTypeService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['material-types'].pagination;
      this.dataSet = data['material-types'].result;
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
    this.materialTypeService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<MaterialType[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingMaterialType');
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm loại vật tư',
      nzContent: MaterialTypeAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        materialType: {},
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
    this.materialTypeService.getDetail(id).subscribe((materialType: MaterialType) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa loại vật tư',
        nzContent: MaterialTypeAddEditModalComponent,
        nzMaskClosable: false,
        nzComponentParams: {
          materialType,
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
      this.materialTypeService.delete(id).subscribe((res: boolean) => {
        this.notify.success('Xóa thành công!');
        this.loadData();
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deleteMaterialType');
      });
    });
  }

  search(keyword: string) {
    this.pagingParams.keyword = keyword;
    this.loadData(true);
  }
}
