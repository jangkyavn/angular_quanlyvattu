import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Material } from 'src/app/shared/models/material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

import { MaterialAddEditModalComponent } from '../modals/material-add-edit-modal/material-add-edit-modal.component';
import { MaterialExportExcelModalComponent } from '../modals/material-export-excel-modal/material-export-excel-modal.component';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent implements OnInit {
  allChecked = false;
  checkedNumber = 0;
  displayData: Array<Material> = [];
  indeterminate = false;

  dataSet = [];
  loading = true;
  isLoadingImport: boolean;
  isLoadingExport: boolean;
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
    private materialService: MaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['material-list'].pagination;
      this.dataSet = data['material-list'].result;
    });
  }

  currentPageDataChange($event: Array<Material>): void {
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
    this.materialService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Material[]>) => {
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
    this.roleService.checkPermission('VAT_TU', 'Create')
      .subscribe((response: boolean) => {
        if (response) {
          const modal = this.modalService.create({
            nzTitle: 'Thêm vật tư',
            nzContent: MaterialAddEditModalComponent,
            nzMaskClosable: false,
            nzClosable: false,
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
    this.roleService.checkPermission('VAT_TU', 'Update')
      .subscribe((response: boolean) => {
        if (response) {
          this.materialService.getDetail(id).subscribe((material: Material) => {
            const modal = this.modalService.create({
              nzTitle: 'Sửa vật tư',
              nzContent: MaterialAddEditModalComponent,
              nzMaskClosable: false,
              nzClosable: false,
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
    this.roleService.checkPermission('VAT_TU', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
            this.materialService.delete(id).subscribe((res: boolean) => {
              if (res) {
                this.notify.success('Xóa thành công!');
                this.loadData();
              } else {
                this.notify.warning('Vật tư đang được sử dụng. Không được xóa!');
              }
            });
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  deleteMulti() {
    this.roleService.checkPermission('VAT_TU', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          const ids = this.displayData.filter(value => value.checked).map((value: Material) => value.maVatTu);
          this.notify.confirm(`Bạn có chắc chắn muốn xóa ${this.checkedNumber} không?`, () => {
            this.materialService.deleteMulti(JSON.stringify(ids))
              .subscribe((res: boolean) => {
                if (res) {
                  this.notify.success('Xóa thành công');
                  this.loadData();
                } else {
                  this.notify.warning('Có tên vật tư đã được sử dụng. Không được xóa!');
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

  changeFile(event: any) {
    this.isLoadingImport = true;
    const files = event.target.files;

    if (files && files[0]) {
      const fileData = new FormData();
      for (let i = 0; i < files.length; i++) {
        fileData.append('files', files[i]);
      }

      this.materialService.importExcel(fileData).subscribe((res) => {
        if (res) {
          this.loadData(true);
          this.notify.success('Nhập excel thành công');
        }

        this.isLoadingImport = false;
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error importExcel');
        this.isLoadingImport = false;
      });
    }
    event.target.value = null;
  }

  exportFile() {
    const modal = this.modalService.create({
      nzTitle: 'Xuất file excel',
      nzContent: MaterialExportExcelModalComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        totalPages: this.pagination.totalPages
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

    modal.afterClose.subscribe((result: any) => {
      if (result) {
        this.isLoadingExport = true;

        if (result.isGetAll) {
          this.materialService.getAllPaging(1, this.pagination.totalItems, this.pagingParams)
            .subscribe((data: PaginatedResult<Material[]>) => {
              this.materialService.exportExcel(data.result).subscribe((res: any) => {
                if (res) {
                  window.location.href = res.url;

                  setTimeout(() => {
                    this.materialService.deleteExportFile(res.fileName).subscribe((rs) => {
                      if (rs) {
                        this.notify.success('Xuất excel thành công');
                      } else {
                        this.notify.success('Xuất excel thất bại');
                      }
                      this.isLoadingExport = false;
                    }, _ => {
                      this.notify.error('Có lỗi xảy ra');
                      console.log('error deleteExcel');
                      this.isLoadingExport = false;
                    }, () => {
                    });
                  }, 1000);
                }
              }, _ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error exportExcel');
                this.isLoadingExport = false;
              });
            });
        } else {
          this.materialService.getAllPaging(result.pageNumber, this.pagination.itemsPerPage, this.pagingParams)
            .subscribe((data: PaginatedResult<Material[]>) => {
              this.materialService.exportExcel(data.result).subscribe((res: any) => {
                if (res) {
                  window.location.href = res.url;

                  setTimeout(() => {
                    this.materialService.deleteExportFile(res.fileName).subscribe((rs) => {
                      if (rs) {
                        this.notify.success('Xuất excel thành công');
                      } else {
                        this.notify.success('Xuất excel thất bại');
                      }
                      this.isLoadingExport = false;
                    }, _ => {
                      this.notify.error('Có lỗi xảy ra');
                      console.log('error deleteExcel');
                      this.isLoadingExport = false;
                    }, () => {
                    });
                  }, 1000);
                }
              }, _ => {
                this.notify.error('Có lỗi xảy ra');
                console.log('error exportExcel');
                this.isLoadingExport = false;
              });
            });
        }
      }
    });
  }
}
