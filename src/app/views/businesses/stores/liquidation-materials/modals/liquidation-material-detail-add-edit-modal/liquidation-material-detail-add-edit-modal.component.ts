import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { LiquidationDetailService } from 'src/app/shared/services/liquidation-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Inventory } from 'src/app/shared/models/inventory.model';
import { LiquidationDetail } from 'src/app/shared/models/liquidation-detail.model';
import { LiquidationMaterial } from 'src/app/shared/models/liquidation-material.model';

@Component({
  selector: 'app-liquidation-material-detail-add-edit-modal',
  templateUrl: './liquidation-material-detail-add-edit-modal.component.html',
  styleUrls: ['./liquidation-material-detail-add-edit-modal.component.scss']
})
export class LiquidationMaterialDetailAddEditModalComponent implements OnInit {
  @Input() liquidationMaterial: LiquidationMaterial;
  @Input() inventory: Inventory;
  @Input() isAddNew: boolean;
  @Input() liquidationDetail: LiquidationDetail;
  liquidationDetailForm: FormGroup;

  constructor(private fb: FormBuilder,
    private modal: NzModalRef,
    private liquidationDetailService: LiquidationDetailService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.liquidationDetailForm = this.fb.group({
      maPhieuThanhLy: [null],
      maPhieuNhap: [{ value: null, disabled: true }],
      maVatTu: [null],
      tenVatTu: [{ value: null, disabled: true }],
      soLuongThanhLy: [1, [Validators.required]],
      dienGiai: [null, [Validators.required]],
      ghiChu: [null]
    });

    if (this.isAddNew) {
      this.liquidationDetailForm.patchValue({
        maPhieuThanhLy: this.liquidationMaterial.maPhieuThanhLy,
        maPhieuNhap: this.inventory.maPhieuNhap,
        maVatTu: this.inventory.maVatTu,
        tenVatTu: this.inventory.tenVatTu,
        soLuongThanhLy: this.inventory.soLuongTon
      });
    } else {
      this.liquidationDetailForm.patchValue({
        ...this.liquidationDetail,
        tenVatTu: this.liquidationDetail.tenVT,
      });
    }
  }

  saveChanges() {
    if (this.liquidationDetailForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.liquidationDetailForm.controls) {
        this.liquidationDetailForm.controls[i].markAsDirty();
        this.liquidationDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const liquidationDetail: LiquidationDetail = Object.assign({}, this.liquidationDetailForm.getRawValue());
    const thanhLyChiTietlParams = {
      thanhlychitiet: liquidationDetail,
      maPTL: this.liquidationMaterial.maPhieuThanhLy,
      maKho: this.liquidationMaterial.maKho
    };

    if (this.isAddNew) {
      this.liquidationDetailService.checkDuplicate(
        liquidationDetail.maPhieuThanhLy,
        liquidationDetail.maPhieuNhap,
        liquidationDetail.maVatTu)
        .subscribe((check: number) => {
          if (check !== -1) {
            thanhLyChiTietlParams.thanhlychitiet.soLuongThanhLy += check;
            this.liquidationDetailService.update(thanhLyChiTietlParams)
              .subscribe((res: any) => {
                if (res >= 0) {
                  this.notify.success('Sửa thành công!');
                  this.modal.destroy(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error updateLiquidationDetail');
                this.modal.destroy(false);
              });
          } else {
            this.liquidationDetailService.addNew(thanhLyChiTietlParams)
              .subscribe((res: any) => {
                if (res) {
                  this.notify.success('Thêm thành công!');
                  this.modal.destroy(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error addLiquidationDetail');
                this.modal.destroy(false);
              });
          }
        });
    } else {
      this.liquidationDetailService.update(thanhLyChiTietlParams)
        .subscribe((res: any) => {
          if (res >= 0) {
            this.notify.success('Sửa thành công!');
            this.modal.destroy(true);
          }
        }, error => {
          this.notify.error('Có lỗi xảy ra!');
          console.log('error updateLiquidationDetail');
          this.modal.destroy(false);
        });
    }
  }
}
