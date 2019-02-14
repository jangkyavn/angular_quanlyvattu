import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Inventory } from 'src/app/shared/models/inventory.model';
import { ExportMaterialDetailService } from 'src/app/shared/services/export-material-detail.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-export-material-detail-modal',
  templateUrl: './export-material-detail-modal.component.html',
  styleUrls: ['./export-material-detail-modal.component.scss']
})
export class ExportMaterialDetailModalComponent implements OnInit {
  @Input() inventory: Inventory;
  @Input() exportMaterialId: number;
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

    this.exportDetailForm.patchValue({
      maPhieuXuat: this.exportMaterialId,
      maPhieuNhap: this.inventory.maPhieuNhap,
      tenVatTu: this.inventory.tenVatTu,
      maVatTu: this.inventory.maVatTu,
      soLuongXuat: this.inventory.soLuongTon
    });
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

    callBack(true);

    const exportDetail = Object.assign({}, this.exportDetailForm.getRawValue());
    const exportDetailParams = {
      exportDetail,
      exportId: this.exportMaterialId
    };

    this.exportDetailService.addNew(exportDetailParams).subscribe((res: any) => {
      if (res) {
        this.notify.success('Thêm thành công!');
        callBack(true);
      }
    }, error => {
      this.notify.success('Có lỗi xảy ra!');
      console.log('error addExportDetail');
      callBack(false);
    });
  }
}
