import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { SupplyService } from 'src/app/shared/services/supply.service';
import { Supply } from 'src/app/shared/models/supply.model';
import { SupplyAddEditModalComponent } from '../supply-add-edit-modal/supply-add-edit-modal.component';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

@Component({
  selector: 'app-supply-list',
  templateUrl: './supply-list.component.html',
  styleUrls: ['./supply-list.component.scss']
})
export class SupplyListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = null;
  sortKey = null;

  supplies: Supply[];
  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: ''
  };

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private supplyService: SupplyService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['supplies'].pagination;
      this.dataSet = data['supplies'].result;
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
    this.supplyService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<Supply[]>) => {
        this.loading = false;
        this.pagination = res.pagination;
        this.dataSet = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('loadUsers: ' + error);
      });
  }

  addNew() {
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
          loading: false,
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
    console.log(id);

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
            loading: false,
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
