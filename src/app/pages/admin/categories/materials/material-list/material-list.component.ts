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
      }, () => {
        if (this.dataSet.length === 0 && this.pagination.currentPage !== 1) {
          this.pagination.currentPage -= 1;
          this.loadData();
        }
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
      this.materialService.delete(id).subscribe((res: boolean) => {
        this.notify.success('Xóa thành công!');
        this.loadData();
      }, _ => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error deleteMaterial');
      });
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
    this.isLoadingExport = true;
    this.materialService.exportExcel().subscribe((res: any) => {
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
  }
}
