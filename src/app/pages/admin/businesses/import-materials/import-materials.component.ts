import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { ImportMaterialService } from 'src/app/shared/services/import-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { ImportMaterial } from 'src/app/shared/models/import-material.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-import-materials',
  templateUrl: './import-materials.component.html',
  styleUrls: ['./import-materials.component.scss']
})
export class ImportMaterialsComponent implements OnInit {
  materialStores: MaterialStore[];
  materialItems: MaterialItem[];
  importMaterialForm: FormGroup;
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private importMaterialService: ImportMaterialService,
    private materialStoreService: MaterialStoreService,
    private materialItemService: MaterialItemService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialStores();
    this.loadAllMaterialItems();
    this.createForm();
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.importMaterialForm = this.fb.group({
      maKho: [null, [Validators.required]],
      maHM: [null, [Validators.required]],
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

  loadAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
  }

  saveChanges() {
    if (this.importMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.importMaterialForm.controls) {
        this.importMaterialForm.controls[i].markAsDirty();
        this.importMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const importMaterial: ImportMaterial = Object.assign({}, this.importMaterialForm.value);
    importMaterial.nguoiNhap = this.authService.currentUser.userName;
    this.importMaterialService.addNew(importMaterial).subscribe((res: any) => {
      if (res) {
        this.notify.success('Thêm mới thành công');
        this.router.navigate(['/admin/nghiep-vu/sua-phieu-nhap', res]);
      }
    }, error => {
      this.notify.error('Có lỗi xảy ra');
      console.log('error addImportMaterial');
      console.log(error);
    });
  }
}
