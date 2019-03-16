import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';

import { InventoryMaterialService } from 'src/app/shared/services/inventory-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';
import { InventoryMaterial } from 'src/app/shared/models/inventory-material.model';
import { RoleService } from 'src/app/shared/services/role.service';
// import {
//   LiquidationMaterialViewDetailModalComponent
// } from '../modals/liquidation-material-view-detail-modal/liquidation-material-view-detail-modal.component';

@Component({
  selector: 'app-inventory-material-list',
  templateUrl: './inventory-material-list.component.html',
  styleUrls: ['./inventory-material-list.component.scss']
})
export class InventoryMaterialListComponent implements OnInit {
  dataSet = [];
  loading = true;
  sortValue = '';
  sortKey = '';

  keyword = '';
  startValue = '';
  endValue = '';

  pagination: Pagination;
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: ''
  };

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && ($event.keyCode === 73 || $event.keyCode === 105)) {
      this.roleService.checkPermission('PHIEU_KIEM_KE_KHO', 'Create')
        .subscribe((response: boolean) => {
          if (response) {
            this.router.navigate(['/nghiep-vu/kho/phieu-kiem-ke-kho/tao-phieu-kiem-ke']);
          } else {
            this.notify.warning('Bạn không có quyền');
          }
        });
    }
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private modalService: NzModalService,
    private roleService: RoleService,
    private inventoryMaterialService: InventoryMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.loading = false;
      this.pagination = data['inventory-material-list'].pagination;
      this.dataSet = data['inventory-material-list'].result;
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
    this.inventoryMaterialService.getAllPaging(this.pagination.currentPage, this.pagination.itemsPerPage, this.pagingParams)
      .subscribe((res: PaginatedResult<InventoryMaterial[]>) => {
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
    this.roleService.checkPermission('PHIEU_KIEM_KE_KHO', 'Create')
      .subscribe((response: boolean) => {
        if (response) {
          this.router.navigate(['/nghiep-vu/kho/phieu-kiem-ke-kho/tao-phieu-kiem-ke']);
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  update(id: number) {
    this.roleService.checkPermission('PHIEU_KIEM_KE_KHO', 'Update')
      .subscribe((response: boolean) => {
        if (response) {
          this.router.navigate(['/nghiep-vu/kho/phieu-kiem-ke-kho/sua-phieu-kiem-ke', id]);
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  view(id: number) {
    // this.liquidationService.getDetail(id).subscribe((res: any) => {
    //   const modal = this.modalService.create({
    //     nzTitle: 'Xem phiếu thanh lý',
    //     nzContent: LiquidationMaterialViewDetailModalComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzWidth: 1000,
    //     nzComponentParams: {
    //       liquidationMaterialParams: res
    //     },
    //     nzFooter: [
    //       {
    //         label: 'Hủy',
    //         shape: 'default',
    //         onClick: () => modal.destroy()
    //       }
    //     ]
    //   });
    // });
  }

  delete(id: number) {
    this.roleService.checkPermission('PHIEU_KIEM_KE_KHO', 'Delete')
      .subscribe((response: boolean) => {
        if (response) {
          this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
            this.inventoryMaterialService.delete(id).subscribe((res: boolean) => {
              if (res) {
                this.loadData();
                this.notify.success('Xóa thành công');
              } else {
                this.notify.warning('Không được xóa vì đã xuất hoặc thanh lý');
              }
            });
          });
        } else {
          this.notify.warning('Bạn không có quyền');
        }
      });
  }

  search() {
    this.pagingParams.keyword = this.keyword;
    this.pagingParams.fromDate = this.startValue;
    this.pagingParams.toDate = this.endValue;
    this.loadData(true);
  }

  refresh() {
    this.startValue = '';
    this.endValue = '';
    this.keyword = '';

    this.pagingParams.keyword = '';
    this.pagingParams.fromDate = '';
    this.pagingParams.toDate = '';
    this.loadData(true);
  }
}
