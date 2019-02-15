import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { Material } from 'src/app/shared/models/material.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { ExportMaterialDetail } from 'src/app/shared/models/export-material-detail.model';
import { Inventory } from 'src/app/shared/models/inventory.model';
import { ExportMaterialDetailModalComponent } from './export-material-detail-modal/export-material-detail-modal.component';
import { ExportMaterialDetailService } from 'src/app/shared/services/export-material-detail.service';

@Component({
  selector: 'app-update-export-materials',
  templateUrl: './update-export-materials.component.html',
  styleUrls: ['./update-export-materials.component.scss']
})
export class UpdateExportMaterialsComponent implements OnInit {
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
  totalPrice: number;
  discount: number;
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler($event: any) {
    if (this.exportMaterialForm.dirty) {
      $event.returnValue = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  loadInventoriesByStoreId(storeId: number, keyword: string = null) {
    this.loadingInventories = true;
    this.exportMaterialService.getInventoriesById(storeId, keyword)
      .subscribe((res: Inventory[]) => {
        this.inventories = res;
        this.loadingInventories = false;
      });
  }

  changeMaterialStore(storeId: number) {
    this.loadInventoriesByStoreId(storeId);
  }

  exportMaterial(inventory: Inventory) {
    const { maPhieuXuat, maKho } = this.exportMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Xuất chi tiết vật tư',
      nzContent: ExportMaterialDetailModalComponent,
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
            componentInstance.saveChanges((res: boolean) => {
              if (res) {
                modal.destroy();
                this.loadExportDetails(maPhieuXuat);
                this.loadInventoriesByStoreId(maKho);
              } else {
                modal.destroy();
              }
            });
          }
        }
      ]
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
      });
  }

  updateExportDetail(exportDetail: ExportMaterialDetail) {
    const { maPhieuXuat, maKho } = this.exportMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa Xuất chi tiết vật tư',
      nzContent: ExportMaterialDetailModalComponent,
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
            componentInstance.saveChanges((res: boolean) => {
              if (res) {
                modal.destroy();
                this.loadExportDetails(maPhieuXuat);
                this.loadInventoriesByStoreId(maKho);
              } else {
                modal.destroy();
              }
            });
          }
        }
      ]
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

  searchInventory(keyword: any) {
    const { maKho } = this.exportMaterialForm.value;
    keyword = keyword || null;
    this.loadInventoriesByStoreId(maKho, keyword);
  }

  loadTotalPrice() {
    this.totalPrice = 0;

    this.exportMaterialDetails.forEach((item: ExportMaterialDetail) => {
      this.totalPrice += item.soLuongXuat * item.donGia;
    });

    const { chietKhau } = this.exportMaterialForm.value;
    this.discount = chietKhau;
    this.totalAmount = this.totalPrice * (1 - chietKhau / 100);
  }
}
