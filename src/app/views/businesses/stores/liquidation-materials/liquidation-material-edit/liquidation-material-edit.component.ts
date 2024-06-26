import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { LiquidationMaterialService } from 'src/app/shared/services/liquidation-material.service';
import { LiquidationDetailService } from 'src/app/shared/services/liquidation-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { LiquidationDetail } from 'src/app/shared/models/liquidation-detail.model';
import { Inventory } from 'src/app/shared/models/inventory.model';
import { LiquidationMaterial } from 'src/app/shared/models/liquidation-material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

import {
  LiquidationMaterialDetailAddEditModalComponent
} from '../modals/liquidation-material-detail-add-edit-modal/liquidation-material-detail-add-edit-modal.component';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

@Component({
  selector: 'app-liquidation-material-edit',
  templateUrl: './liquidation-material-edit.component.html',
  styleUrls: ['./liquidation-material-edit.component.scss']
})
export class LiquidationMaterialEditComponent implements OnInit, AfterViewInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  liquidationMaterialForm: FormGroup;
  inventories: Inventory[];
  liquidationDetails: LiquidationDetail[];
  loadingLiquidationDetails: boolean;
  loadingInventories: boolean;
  totalQuantity: number;

  sortValue = '';
  sortKey = '';
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 5
  };
  pagingParams: PagingParams = {
    keyword: '',
    sortKey: '',
    sortValue: '',
    fromDate: '',
    toDate: '',
    searchKey: '',
    searchValue: ''
  };

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private liquidationMaterialService: LiquidationMaterialService,
    private liquidationDetailService: LiquidationDetailService,
    private notify: NotifyService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const result = data['check-permission-update'];
      if (!result) {
        this.router.navigate(['/']);
        this.notify.warning('Bạn không có quyền');
      }
    });

    this.inventories = [];
    this.loadingLiquidationDetails = true;

    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.createForm();

    this.route.data.subscribe(data => {
      this.loadingLiquidationDetails = false;

      const { mthanhlyvattu, listThanhlychitiet } = data['liquidation-material'];
      if (!mthanhlyvattu.status) {
        this.router.navigate(['/nghiep-vu/kho/thanh-ly-vat-tu']);
        return;
      }

      this.liquidationMaterialForm.patchValue(mthanhlyvattu);
      this.liquidationDetails = listThanhlychitiet;
      if (this.liquidationDetails.length > 0) {
        this.liquidationMaterialForm.controls['ngayThanhLy'].disable();
      }
      this.loadInventoriesByStoreId(true);
      this.loadTotalQuantity();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.liquidationMaterialForm = this.fb.group({
      maPhieuThanhLy: [null],
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      tenKho: [{ value: null, disabled: true }],
      tenNS: [null],
      ngayThanhLy: [currentDate, [Validators.required]],
    });
  }

  sortInventories(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadInventoriesByStoreId();
  }

  loadInventoriesByStoreId(reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loadingInventories = true;
    const { maKho, ngayThanhLy } = this.liquidationMaterialForm.getRawValue();
    this.liquidationMaterialService.getInventoriesByStoreId(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.pagingParams, maKho, ngayThanhLy)
      .subscribe((res: PaginatedResult<Inventory[]>) => {
        this.loadingInventories = false;
        this.pagination = res.pagination;
        this.inventories = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingInventory');
      });
  }

  loadAllMaterialStores() {
    this.materialStoreService.getAll().subscribe((res: MaterialStore[]) => {
      this.materialStores = res;
    });
  }

  loadAllPersonnels() {
    this.personnelService.getAll().subscribe((res: Personnel[]) => {
      this.personnels = res;
    });
  }

  loadLiquidationDetails(liquidationId: number) {
    this.loadingLiquidationDetails = true;
    this.liquidationDetailService.getDetailsByLiquidationId(liquidationId)
      .subscribe((res: LiquidationDetail[]) => {
        this.liquidationDetails = res;
        this.loadingLiquidationDetails = false;
        if (this.liquidationDetails.length > 0) {
          this.liquidationMaterialForm.controls['ngayThanhLy'].disable();
        } else {
          this.liquidationMaterialForm.controls['ngayThanhLy'].enable();
        }
        this.loadTotalQuantity();
      });
  }

  saveChanges() {
    if (this.liquidationMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.liquidationMaterialForm.controls) {
        this.liquidationMaterialForm.controls[i].markAsDirty();
        this.liquidationMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const liquidation = Object.assign({}, this.liquidationMaterialForm.getRawValue());
    this.liquidationMaterialService.update(liquidation).subscribe((res: number) => {
      if (res) {
        this.notify.success('Sửa thành công!');
        this.liquidationMaterialForm.markAsPristine();
        this.liquidationMaterialForm.updateValueAndValidity();
        this.loadInventoriesByStoreId(true);
      }
    }, error => {
      console.log('error updateLiquidationMaterial');
      console.log(error);
    });
  }

  searchInventory(keyword: any) {
    this.pagingParams.keyword = keyword;
    this.loadInventoriesByStoreId(true);
  }

  createLiquidationDetail(inventory: Inventory) {
    const liquidationMaterial: LiquidationMaterial = this.liquidationMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Tạo thanh lý chi tiết',
      nzContent: LiquidationMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        inventory,
        liquidationMaterial,
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
        this.loadLiquidationDetails(liquidationMaterial.maPhieuThanhLy);
        this.loadInventoriesByStoreId();
      }
    });
  }

  updateLiquidationDetail(liquidationDetail: LiquidationDetail) {
    const liquidationMaterial: LiquidationMaterial = this.liquidationMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa thanh lý chi tiết',
      nzContent: LiquidationMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        liquidationMaterial,
        liquidationDetail,
        isAddNew: false
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
        this.loadLiquidationDetails(liquidationMaterial.maPhieuThanhLy);
        this.loadInventoriesByStoreId();
      }
    });
  }

  deleteLiquidationDetail(liquidationDetail: LiquidationDetail) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      const { maPhieuThanhLy, maPhieuNhap, maVatTu } = liquidationDetail;
      const { maKho } = this.liquidationMaterialForm.value;
      this.liquidationDetailService.delete(maPhieuThanhLy, maPhieuNhap, maVatTu, maKho)
        .subscribe((res: boolean) => {
          if (res) {
            this.loadLiquidationDetails(maPhieuThanhLy);
            this.loadInventoriesByStoreId();
          }
        });
    });
  }

  loadTotalQuantity() {
    this.totalQuantity = 0;

    this.liquidationDetails.forEach((item: LiquidationDetail) => {
      this.totalQuantity += item.soLuongThanhLy;
    });
  }

  searchColumn(searchKey: string) {
    this.pagingParams.searchKey = searchKey;
    this.loadInventoriesByStoreId();
  }

  reset() {
    this.pagingParams.searchKey = '';
    this.pagingParams.searchValue = '';
    this.loadInventoriesByStoreId();
  }
}
