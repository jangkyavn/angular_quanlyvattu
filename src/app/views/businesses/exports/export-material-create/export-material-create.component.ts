import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { ExportMaterialService } from 'src/app/shared/services/export-material.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';

@Component({
  selector: 'app-export-material-create',
  templateUrl: './export-material-create.component.html',
  styleUrls: ['./export-material-create.component.scss']
})
export class ExportMaterialCreateComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  exportMaterialForm: FormGroup;
  formatterPercent = value => `${value} %`;
  parserPercent = value => value.replace(' %', '');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private exportMaterialService: ExportMaterialService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      const result = data['check-permission-create'];
      if (!result) {
        this.router.navigate(['/']);
        this.notify.warning('Bạn không có quyền');
      }
    });

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
        this.router.navigate(['/nghiep-vu/xuat/sua-phieu-xuat', res]);
      }
    }, error => {
      console.log('error addExportMaterial');
      console.log(error);
    });
  }
}
