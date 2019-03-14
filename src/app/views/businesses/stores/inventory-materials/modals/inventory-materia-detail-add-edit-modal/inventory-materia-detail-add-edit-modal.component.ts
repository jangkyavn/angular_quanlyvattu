import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { InventoryMaterialDetailService } from 'src/app/shared/services/inventory-material-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Inventory } from 'src/app/shared/models/inventory.model';
import { InventoryMaterial } from 'src/app/shared/models/inventory-material.model';
import { InventoryMaterialDetail } from 'src/app/shared/models/inventory-material-detail.model';

@Component({
  selector: 'app-inventory-materia-detail-add-edit-modal',
  templateUrl: './inventory-materia-detail-add-edit-modal.component.html',
  styleUrls: ['./inventory-materia-detail-add-edit-modal.component.scss']
})
export class InventoryMateriaDetailAddEditModalComponent implements OnInit {
  @Input() inventoryMaterial: InventoryMaterial;
  @Input() inventory: Inventory;
  @Input() isAddNew: boolean;
  @Input() inventoryMaterialDetail: InventoryMaterialDetail;
  inventoryMaterialDetailForm: FormGroup;

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private inventoryMaterialDetailService: InventoryMaterialDetailService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.inventoryMaterialDetailForm = this.fb.group({
      maPhieuKiemKe: [null],
      maPhieuNhap: [{ value: null, disabled: true }],
      maVatTu: [null],
      tenVatTu: [{ value: null, disabled: true }],
      soLuongTheoDoi: [{ value: null, disabled: true }],
      soLuongThucTon: [null, [Validators.required]],
      soLuongKiemKe: [null],
      ghiChu: [null]
    });

    if (this.isAddNew) {
      this.inventoryMaterialDetailForm.patchValue({
        maPhieuKiemKe: this.inventoryMaterial.maPhieuKiemKe,
        maPhieuNhap: this.inventory.maPhieuNhap,
        maVatTu: this.inventory.maVatTu,
        tenVatTu: this.inventory.tenVatTu,
        soLuongTheoDoi: this.inventory.soLuongTon
      });
    } else {
      this.inventoryMaterialDetailForm.patchValue(this.inventoryMaterialDetail);
    }
  }

  saveChanges() {
    if (this.inventoryMaterialDetailForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.inventoryMaterialDetailForm.controls) {
        this.inventoryMaterialDetailForm.controls[i].markAsDirty();
        this.inventoryMaterialDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const inventoryMaterialDetail: InventoryMaterialDetail = Object.assign({}, this.inventoryMaterialDetailForm.getRawValue());
    const kiemKeChiTietParams = {
      mkiemkechitiet: inventoryMaterialDetail,
      maPKK: this.inventoryMaterial.maPhieuKiemKe,
      maKho: this.inventoryMaterial.maKho
    };

    console.log(this.isAddNew);
    if (this.isAddNew) {
      this.inventoryMaterialDetailService.addNew(kiemKeChiTietParams)
        .subscribe((res: any) => {
          console.log(res);
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        });
    } else {
      this.inventoryMaterialDetailService.update(kiemKeChiTietParams)
        .subscribe((res: any) => {
          if (res) {
            this.notify.success('Sửa thành công!');
            this.modal.destroy(true);
          }
        });
    }
  }
}
