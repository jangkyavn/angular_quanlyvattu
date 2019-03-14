import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialService } from 'src/app/shared/services/material.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { InventoryMaterialService } from 'src/app/shared/services/inventory-material.service';
import { InventoryMaterialDetailService } from 'src/app/shared/services/inventory-material-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { UtilitiesService } from 'src/app/shared/services/utilities.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { InventoryMaterialDetail } from 'src/app/shared/models/inventory-material-detail.model';
import { Inventory } from 'src/app/shared/models/inventory.model';
import { InventoryMaterial } from 'src/app/shared/models/inventory-material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

import {
  InventoryMateriaDetailAddEditModalComponent
} from '../modals/inventory-materia-detail-add-edit-modal/inventory-materia-detail-add-edit-modal.component';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';
import { Material } from 'src/app/shared/models/material.model';

@Component({
  selector: 'app-inventory-material-edit',
  templateUrl: './inventory-material-edit.component.html',
  styleUrls: ['./inventory-material-edit.component.scss']
})
export class InventoryMaterialEditComponent implements OnInit, AfterViewInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  importMaterials: ImportMaterial[];
  materials: Material[];
  inventoryMaterialForm: FormGroup;
  inventories: Inventory[];
  inventoryMaterailDetails: InventoryMaterialDetail[];
  loadingInventoryMaterialDetails: boolean;
  loadingInventories: boolean;
  totalQuantity: number;
  materialSearch: any = null;
  importMaterialSearch: any = null;
  isShowAllInventories = false;

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
    toDate: ''
  };

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private importMaterialService: ImportMaterialService,
    private materailService: MaterialService,
    private inventoryMaterialService: InventoryMaterialService,
    private inventoryMaterialDetailService: InventoryMaterialDetailService,
    private notify: NotifyService,
    private utilities: UtilitiesService) { }

  ngOnInit() {
    this.inventories = [];
    this.loadingInventoryMaterialDetails = true;

    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.loadAllImportMaterials();
    this.loadAllMaterials();
    this.createForm();

    this.route.data.subscribe(data => {
      this.loadingInventoryMaterialDetails = false;
      const { mKiemKeVatTu, listKiemKeChiTiet } = data['inventory-material'];
      this.inventoryMaterialForm.patchValue(mKiemKeVatTu);
      this.inventoryMaterailDetails = listKiemKeChiTiet;
      if (this.inventoryMaterailDetails.length > 0) {
        this.inventoryMaterialForm.controls['ngayKiemKe'].disable();
      }
      this.loadInventories(true);
      // this.loadTotalQuantity();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.utilities.changeCollapsed(true);
    }, 0);
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.inventoryMaterialForm = this.fb.group({
      maPhieuKiemKe: [null],
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      tenKho: [{ value: null, disabled: true }],
      tenNS: [null],
      ngayKiemKe: [currentDate, [Validators.required]],
    });
  }

  sortInventories(sort: { key: string, value: string }): void {
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadInventories();
  }

  loadInventories(reset: boolean = false): void {
    const { maPhieuKiemKe } = this.inventoryMaterialForm.value;
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loadingInventories = true;
    const { maKho } = this.inventoryMaterialForm.getRawValue();
    this.inventoryMaterialService.getInventories(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.pagingParams,
      maKho,
      this.importMaterialSearch || '',
      this.materialSearch || '',
      maPhieuKiemKe,
      this.isShowAllInventories)
      .subscribe((res: PaginatedResult<Inventory[]>) => {
        this.loadingInventories = false;
        this.pagination = res.pagination;
        this.inventories = res.result;
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

  loadAllImportMaterials() {
    this.importMaterialService.getAll()
      .subscribe((res: ImportMaterial[]) => {
        this.importMaterials = res;
      });
  }

  loadAllMaterials() {
    this.materailService.getAll()
      .subscribe((res: Material[]) => {
        this.materials = res;
      });
  }

  loadInventoryMaterialDetails(inventoryMaterialId: number) {
    this.loadingInventoryMaterialDetails = true;
    this.inventoryMaterialDetailService.getDetailsByInventoryMateralId(inventoryMaterialId)
      .subscribe((res: InventoryMaterialDetail[]) => {
        this.inventoryMaterailDetails = res;
        this.loadingInventoryMaterialDetails = false;
        if (this.inventoryMaterailDetails.length > 0) {
          this.inventoryMaterialForm.controls['ngayKiemKe'].disable();
        } else {
          this.inventoryMaterialForm.controls['ngayKiemKe'].enable();
        }
        // this.loadTotalQuantity();
      });
  }

  saveChanges() {
    if (this.inventoryMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.inventoryMaterialForm.controls) {
        this.inventoryMaterialForm.controls[i].markAsDirty();
        this.inventoryMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const inventoryMaterial = Object.assign({}, this.inventoryMaterialForm.getRawValue());
    this.inventoryMaterialService.update(inventoryMaterial).subscribe((res: boolean) => {
      if (res) {
        this.notify.success('Sửa thành công!');
        this.inventoryMaterialForm.markAsPristine();
        this.inventoryMaterialForm.updateValueAndValidity();
        this.loadInventories(true);
      }
    });
  }

  searchInventory(keyword: any) {
    this.pagingParams.keyword = keyword;
    this.loadInventories(true);
  }

  createInventoryMaterialDetail(inventory: Inventory) {
    const inventoryMaterial: InventoryMaterial = this.inventoryMaterialForm.value;
    const modal = this.modalService.create({
      nzTitle: 'Thêm kiểm kê chi tiết',
      nzContent: InventoryMateriaDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        inventoryMaterial,
        inventory,
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
        this.loadInventories();
        this.loadInventoryMaterialDetails(inventoryMaterial.maPhieuKiemKe);
        this.notify.success('Thêm mới thành công');
      }
    });
  }

  updateInventoryMaterialDetail(inventoryMaterialDetail: InventoryMaterialDetail) {
    const inventoryMaterial: InventoryMaterial = this.inventoryMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa kiểm kê chi tiết',
      nzContent: InventoryMateriaDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        inventoryMaterial,
        inventoryMaterialDetail,
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
        this.loadInventories();
        this.loadInventoryMaterialDetails(inventoryMaterial.maPhieuKiemKe);
        this.notify.success('Sửa thành công');
      }
    });
  }

  deleteInventoryMaterialDetail(inventoryMaterialDetail: InventoryMaterialDetail) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      const { maPhieuKiemKe, maPhieuNhap, maVatTu } = inventoryMaterialDetail;
      const { maKho } = this.inventoryMaterialForm.value;
      this.inventoryMaterialDetailService.delete(maPhieuKiemKe, maPhieuNhap, maVatTu, maKho)
        .subscribe((res: boolean) => {
          if (res) {
            this.loadInventories();
            this.loadInventoryMaterialDetails(maPhieuKiemKe);
            this.notify.success('Xóa thành công');
          } else {
            this.notify.warning('Không được xóa vì đã xuất hoặc thanh lý');
          }
        });
    });
  }

  loadTotalQuantity() {
    // this.totalQuantity = 0;

    // this.liquidationDetails.forEach((item: LiquidationDetail) => {
    //   this.totalQuantity += item.soLuongThanhLy;
    // });
  }

  refreshInventory() {
    this.importMaterialSearch = null;
    this.materialSearch = null;
    this.pagingParams.keyword = '';
    this.loadInventories(true);
  }
}
