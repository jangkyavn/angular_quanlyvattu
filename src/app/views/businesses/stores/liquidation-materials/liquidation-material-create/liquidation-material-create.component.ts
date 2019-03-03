import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { LiquidationMaterialService } from 'src/app/shared/services/liquidation-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';

@Component({
  selector: 'app-liquidation-material-create',
  templateUrl: './liquidation-material-create.component.html',
  styleUrls: ['./liquidation-material-create.component.scss']
})
export class LiquidationMaterialCreateComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  liquidationMaterialForm: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private liquidationMaterialService: LiquidationMaterialService,
    private notify: NotifyService) { }

  ngOnInit() {
    this.loadAllMaterialStores();
    this.loadAllPersonnels();
    this.createForm();
  }

  createForm() {
    const date = new Date();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.liquidationMaterialForm = this.fb.group({
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      ngayThanhLy: [currentDate, [Validators.required]],
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
    if (this.liquidationMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.liquidationMaterialForm.controls) {
        this.liquidationMaterialForm.controls[i].markAsDirty();
        this.liquidationMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const liquidation = Object.assign({}, this.liquidationMaterialForm.value);
    this.liquidationMaterialService.addNew(liquidation).subscribe((res: number) => {
      if (res) {
        this.notify.success('Thêm mới thành công!');
        this.router.navigate(['/admin/nghiep-vu/sua-phieu-thanh-ly', res]);
      }
    }, error => {
      console.log('error addLiquidationMaterial');
      console.log(error);
    });
  }
}
