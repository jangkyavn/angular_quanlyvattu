import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialType } from 'src/app/shared/models/material-type.model';
import { MaterialTypeAddEditModalComponent } from '../modals/material-type-add-edit-modal/material-type-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { RoleService } from 'src/app/shared/services/role.service';

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
    private materialTypeService: MaterialTypeService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['material-type-list'].pagination;
      this.dataSet = data['material-type-list'].result;
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

        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
      });
  }

  addNew() {
    this.roleService.checkPermission('LOAI_VAT_TU', 'Create')
      .subscribe((response: boolean) => {
        if (response) {
          const modal = this.modalService.create({
            nzTitle: 'Thêm loại vật tư',
            nzContent: MaterialTypeAddEditModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
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
    this.roleService.checkPermission('LOAI_VAT_TU', 'Update')
      .subscribe((response: boolean) => {
        if (response) {
          this.materialTypeService.getDetail(id).subscribe((materialType: MaterialType) => {
            const modal = this.modalService.create({
              nzTitle: 'Sửa loại vật tư',
              nzContent: MaterialTypeAddEditModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
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
    this.roleService.checkPermission('LOAI_VAT_TU', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
            this.materialTypeService.delete(id).subscribe((res: boolean) => {
              if (res) {
                this.notify.success('Xóa thành công!');
                this.loadData();
              } else {
                this.notify.warning('Loại vật tư đang được sử dụng. Không được xóa!');
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
