import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Inventory } from 'src/app/shared/models/inventory.model';
import { ExportMaterialDetailService } from 'src/app/shared/services/export-material-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialDetail } from 'src/app/shared/models/export-material-detail.model';

@Component({
  selector: 'app-export-material-detail-modal',
  templateUrl: './export-material-detail-modal.component.html',
  styleUrls: ['./export-material-detail-modal.component.scss']
})
export class ExportMaterialDetailModalComponent implements OnInit {
  @Input() inventory: Inventory;
  @Input() materialStoreId: number;
  @Input() exportMaterialId: number;
  @Input() isAddNew: boolean;
  @Input() exportDetail: ExportMaterialDetail;
  exportDetailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exportDetailService: ExportMaterialDetailService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.exportDetailForm = this.fb.group({
      maPhieuXuat: [null],
      maPhieuNhap: [{ value: null, disabled: true }],
      maVatTu: [null],
      tenVatTu: [{ value: null, disabled: true }],
      soLuongXuat: [1, [Validators.required]],
      donGia: [0, [Validators.required]],
      ghiChu: [null]
    });

    if (this.isAddNew) {
      this.exportDetailForm.patchValue({
        maPhieuXuat: this.exportMaterialId,
        maPhieuNhap: this.inventory.maPhieuNhap,
        tenVatTu: this.inventory.tenVatTu,
        maVatTu: this.inventory.maVatTu,
        soLuongXuat: this.inventory.soLuongTon
      });
    } else {
      this.exportDetailForm.patchValue({
        ...this.exportDetail,
        tenVatTu: this.exportDetail.tenVT,
      })
    }
  }

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.exportDetailForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.exportDetailForm.controls) {
        this.exportDetailForm.controls[i].markAsDirty();
        this.exportDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const exportDetail: ExportMaterialDetail = Object.assign({}, this.exportDetailForm.getRawValue());
    const exportDetailParams = {
      exportDetail,
      exportId: this.exportMaterialId,
      storeId: this.materialStoreId
    };

    if (this.isAddNew) {
      this.exportDetailService.checkDuplicate(exportDetail.maPhieuXuat, exportDetail.maPhieuNhap, exportDetail.maVatTu)
        .subscribe((check: number) => {
          if (check !== -1) {
            exportDetailParams.exportDetail.soLuongXuat += check;
            this.exportDetailService.update(exportDetailParams)
              .subscribe((res: any) => {
                if (res >= 0) {
                  this.notify.success('Sửa thành công!');
                  callBack(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error updateExportDetail');
                callBack(false);
              });
          } else {
            this.exportDetailService.addNew(exportDetailParams)
              .subscribe((res: any) => {
                if (res) {
                  this.notify.success('Thêm thành công!');
                  callBack(true);
                }
              }, error => {
                this.notify.error('Có lỗi xảy ra!');
                console.log('error addExportDetail');
                callBack(false);
              });
          }
        });
    } else {
      this.exportDetailService.update(exportDetailParams)
        .subscribe((res: any) => {
          if (res >= 0) {
            this.notify.success('Sửa thành công!');
            callBack(true);
          }
        }, error => {
          this.notify.error('Có lỗi xảy ra!');
          console.log('error updateExportDetail');
          callBack(false);
        });
    }
  }

  blurPrice(event: any) {
    if (event.target.value.indexOf('-') > -1) {
      const donGiaControl = this.exportDetailForm.get(`donGia`);
      donGiaControl.setValue(0);
    }
  }
}
