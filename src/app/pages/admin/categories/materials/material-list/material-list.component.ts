import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Material } from 'src/app/shared/models/material.model';
import { MaterialAddEditModalComponent } from '../material-add-edit-modal/material-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
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
    private materialService: MaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['materials'].pagination;
      this.dataSet = data['materials'].result;
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
    this.materialService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Material[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingMaterial');
      });
  }

  addNew() {
    const modal = this.modalService.create({
      nzTitle: 'Thêm vật tư',
      nzContent: MaterialAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        material: {},
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
    this.materialService.getDetail(id).subscribe((material: Material) => {
      const modal = this.modalService.create({
        nzTitle: 'Sửa vật tư',
        nzContent: MaterialAddEditModalComponent,
        nzMaskClosable: false,
        nzComponentParams: {
          material,
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
