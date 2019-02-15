import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';
import { checkExportQuantityValidator } from 'src/app/shared/vailidators/check-export-quantity-validator';

@Component({
  selector: 'app-export-materials',
  templateUrl: './export-materials.component.html',
  styleUrls: ['./export-materials.component.scss']
})
export class ExportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  exportMaterialForm: FormGroup;
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.createForm();
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ?  date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.exportMaterialForm = this.fb.group({
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      ngayNhap: [currentDate, [Validators.required]],
      chietKhau: [0],
      ghiChu: [null]
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
    this.exportMaterialService.addNew(exportMaterial).subscribe((res: number) => {
      if (res) {
        this.notify.success('Thêm mới thành công!');
        this.router.navigate(['/admin/nghiep-vu/sua-phieu-xuat', res]);
      }
    }, error => {
      console.log('error addExportMaterial');
      console.log(error);
    });
  }

  checkStatus(idx: any, matVatTu: any, maPhieuNhap: any, soLuong: number) {
    const soLuongControl = this.exportMaterialForm.get(`listxuatchitiet.${idx}.soLuongXuat`);
    soLuongControl.setAsyncValidators(checkExportQuantityValidator(this.exportMaterialService,
      maPhieuNhap, matVatTu, soLuong));
    soLuongControl.updateValueAndValidity();
  }
}
