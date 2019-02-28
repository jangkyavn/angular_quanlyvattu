import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NzModalService } from 'ng-zorro-antd';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { LiquidationMaterialService } from 'src/app/shared/services/liquidation-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';
import { LiquidationDetail } from 'src/app/shared/models/liquidation-detail.model';
import { Inventory } from 'src/app/shared/models/inventory.model';
import { LiquidationDetailModalComponent } from './liquidation-detail-modal/liquidation-detail-modal.component';
import { LiquidationDetailService } from 'src/app/shared/services/liquidation-detail.service';
import { LiquidationMaterial } from 'src/app/shared/models/liquidation-material.model';

@Component({
  selector: 'app-update-liquidation-material',
  templateUrl: './update-liquidation-material.component.html',
  styleUrls: ['./update-liquidation-material.component.scss']
})
export class UpdateLiquidationMaterialComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  liquidationMaterialForm: FormGroup;
  inventories: Inventory[];
  liquidationDetails: LiquidationDetail[];
  loadingLiquidationDetails: boolean;
  loadingInventories: boolean;
  totalQuantity: number;

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private liquidationMaterialService: LiquidationMaterialService,
    private liquidationDetailService: LiquidationDetailService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.inventories = [];
    this.loadingLiquidationDetails = true;

    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.createForm();

    this.route.data.subscribe(data => {
      this.loadingLiquidationDetails = false;

      const { mthanhlyvattu, listThanhlychitiet } = data['liquidation-material'];
      this.liquidationMaterialForm.patchValue(mthanhlyvattu);
      this.liquidationDetails = listThanhlychitiet;
      this.loadInventoriesByStoreId(mthanhlyvattu.maKho);
      this.loadTotalQuantity();

      console.log(mthanhlyvattu);
    });
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
      tenKho: [null],
      tenNS: [null],
      ngayThanhLy: [currentDate, [Validators.required]],
    });
  }

  loadInventoriesByStoreId(storeId: number, keyword: string = null) {
    this.loadingInventories = true;
    this.liquidationMaterialService.getInventoriesById(storeId, keyword)
      .subscribe((res: Inventory[]) => {
        this.inventories = res;
        this.loadingInventories = false;
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

    const liquidation = Object.assign({}, this.liquidationMaterialForm.value);
    this.liquidationMaterialService.update(liquidation).subscribe((res: number) => {
      if (res) {
        this.notify.success('Sửa thành công!');
      }
    }, error => {
      console.log('error updateLiquidationMaterial');
      console.log(error);
    });
  }

  searchInventory(keyword: any) {
    const { maKho } = this.liquidationMaterialForm.value;
    keyword = keyword || null;
    this.loadInventoriesByStoreId(maKho, keyword);
  }

  createLiquidationDetail(inventory: Inventory) {
    const liquidationMaterial: LiquidationMaterial = this.liquidationMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Tạo thanh lý chi tiết',
      nzContent: LiquidationDetailModalComponent,
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
        this.loadInventoriesByStoreId(liquidationMaterial.maKho);
      }
    });
  }

  updateLiquidationDetail(liquidationDetail: LiquidationDetail) {
    const liquidationMaterial: LiquidationMaterial = this.liquidationMaterialForm.value;

    const modal = this.modalService.create({
      nzTitle: 'Sửa thanh lý chi tiết',
      nzContent: LiquidationDetailModalComponent,
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
        this.loadInventoriesByStoreId(liquidationMaterial.maKho);
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
            this.loadInventoriesByStoreId(maKho);
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
}
