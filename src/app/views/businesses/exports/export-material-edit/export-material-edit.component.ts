import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { ExportMaterialDetailService } from 'src/app/shared/services/export-material-detail.service';

import { ExportMaterialDetail } from 'src/app/shared/models/export-material-detail.model';
import { Inventory } from 'src/app/shared/models/inventory.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';
import { Pagination, PaginatedResult } from 'src/app/shared/models/pagination.model';
import { PagingParams } from 'src/app/shared/params/paging.param';

import {
  ExportMaterialDetailAddEditModalComponent
} from '../modals/export-material-detail-add-edit-modal/export-material-detail-add-edit-modal.component';


@Component({
  selector: 'app-export-material-edit',
  templateUrl: './export-material-edit.component.html',
  styleUrls: ['./export-material-edit.component.scss']
})
export class ExportMaterialEditComponent implements OnInit {
  loadingInventories: boolean;
  loadingExportDetails: boolean;
  materialStores: MaterialStore[];
  personnels: Personnel[];
  inventories: Inventory[];
  materials: Material[];
  importMaterials: number[];
  exportMaterialDetails: ExportMaterialDetail[];
  exportMaterialForm: FormGroup;

  totalAmount: number;
  totalAmountAfterDiscount: number;
  discountPrice: number;
  discount: number;

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

  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private exportDetailService: ExportMaterialDetailService,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.inventories = [];
    this.exportMaterialDetails = [];

    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.createForm();
  }

  createForm() {
    this.exportMaterialForm = this.fb.group({
      maPhieuXuat: [null, [Validators.required]],
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      ngayNhap: [null, [Validators.required]],
      tenKho: [null],
      tenNS: [null],
      chietKhau: [0],
      ghiChu: [null],
      tongSoTien: [null],
      tongSoLuong: [null]
    });

    this.route.data.subscribe(data => {
      const { mxuatvattu, listxuatchitiet } = data['export-material'];

      this.exportMaterialForm.patchValue(mxuatvattu);
      this.loadInventoriesByStoreId(mxuatvattu.maKho);
      this.exportMaterialDetails = listxuatchitiet;
      this.loadTotalPrice();
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

  sortInventories(sort: { key: string, value: string }): void {
    const { maKho } = this.exportMaterialForm.value;
    this.pagingParams.sortKey = sort.key;
    this.pagingParams.sortValue = sort.value;
    this.loadInventoriesByStoreId(maKho);
  }

  loadInventoriesByStoreId(storeId: number, reset: boolean = false): void {
    if (reset) {
      this.pagination.currentPage = 1;
    }
    this.loadingInventories = true;
    this.exportMaterialService.getInventoriesByStoreId(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.pagingParams, storeId)
      .subscribe((res: PaginatedResult<Inventory[]>) => {
        this.loadingInventories = false;
        this.pagination = res.pagination;
        this.inventories = res.result;
      }, error => {
        this.notify.error('Có lỗi xảy ra');
        console.log('error getAllPagingInventory');
      });
  }

  searchInventory(keyword: any) {
    const { maKho } = this.exportMaterialForm.value;
    this.pagingParams.keyword = keyword;

    this.loadInventoriesByStoreId(maKho, true);
  }

  exportMaterial(inventory: Inventory) {
    const { maPhieuXuat, maKho } = this.exportMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Xuất chi tiết vật tư',
      nzContent: ExportMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        inventory,
        materialStoreId: maKho,
        exportMaterialId: maPhieuXuat,
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
        this.loadExportDetails(maPhieuXuat);
        this.loadInventoriesByStoreId(maKho);
      }
    });
  }

  saveChanges() {
    if (this.exportMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.exportMaterialForm.controls) {
        this.exportMaterialForm.controls[i].markAsDirty();
        this.exportMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const exportMaterial = Object.assign({}, this.exportMaterialForm.value);
    this.exportMaterialService.update(exportMaterial).subscribe((res: any) => {
      if (res) {
        this.notify.success('Sửa thành công');
        this.exportMaterialForm.markAsPristine();
        this.exportMaterialForm.updateValueAndValidity();
        this.loadTotalPrice();
      }
    }, error => {
      this.notify.error('Có lỗi xảy ra');
      console.log('error updateExportMaterial');
    });
  }

  loadExportDetails(exportId: number) {
    this.loadingExportDetails = true;
    this.exportDetailService.getAllByImportId(exportId)
      .subscribe((res: ExportMaterialDetail[]) => {
        this.exportMaterialDetails = res;
        this.loadingExportDetails = false;
        this.loadTotalPrice();
      });
  }

  updateExportDetail(exportDetail: ExportMaterialDetail) {
    const { maPhieuXuat, maKho } = this.exportMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa Xuất chi tiết vật tư',
      nzContent: ExportMaterialDetailAddEditModalComponent,
      nzMaskClosable: false,
      nzComponentParams: {
        materialStoreId: maKho,
        exportDetail,
        exportMaterialId: maPhieuXuat,
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
        this.loadExportDetails(maPhieuXuat);
        this.loadInventoriesByStoreId(maKho);
      }
    });
  }

  deleteExportDetail(exportDetail: ExportMaterialDetail) {
    this.notify.confirm('Bạn có chắc chắn muốn xóa không?', () => {
      const { maPhieuXuat, maPhieuNhap, maVatTu } = exportDetail;
      const { maKho } = this.exportMaterialForm.value;
      this.exportDetailService.delete(maPhieuXuat, maPhieuNhap, maVatTu, maKho)
        .subscribe((res: boolean) => {
          if (res) {
            this.loadExportDetails(maPhieuXuat);
            this.loadInventoriesByStoreId(maKho);
          }
        });
    });
  }

  loadTotalPrice() {
    this.totalAmount = 0;
    this.totalAmountAfterDiscount = 0;
    this.discountPrice = 0;

    let idx = 0;
    this.exportMaterialDetails.forEach((item: ExportMaterialDetail) => {
      idx++;
      this.totalAmount += item.soLuongXuat * item.donGia;

      if (this.exportMaterialDetails.length === idx) {
        const { chietKhau } = this.exportMaterialForm.value;
        this.discount = chietKhau;
        this.totalAmountAfterDiscount = this.totalAmount * (1 - chietKhau / 100);
        this.discountPrice = this.totalAmount - this.totalAmountAfterDiscount;
      }
    });
  }
}
