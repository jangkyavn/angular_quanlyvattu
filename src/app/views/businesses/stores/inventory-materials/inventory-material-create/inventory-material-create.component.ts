import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { PersonnelService } from 'src/app/shared/services/personnel.service';
import { InventoryMaterialService } from 'src/app/shared/services/inventory-material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { Personnel } from 'src/app/shared/models/personnel.model';

@Component({
  selector: 'app-inventory-material-create',
  templateUrl: './inventory-material-create.component.html',
  styleUrls: ['./inventory-material-create.component.scss']
})
export class InventoryMaterialCreateComponent implements OnInit {
  materialStores: MaterialStore[];
  personnels: Personnel[];
  inventoryMaterialForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private materialStoreService: MaterialStoreService,
    private personnelService: PersonnelService,
    private inventoryMaterialService: InventoryMaterialService,
    private notify: NotifyService) { }

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
    const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    const currentDate = `${date.getFullYear()}-${month}-${day}`;

    this.inventoryMaterialForm = this.fb.group({
      maKho: [null, [Validators.required]],
      maNS: [null, [Validators.required]],
      ngayKiemKe: [currentDate, [Validators.required]],
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
    if (this.inventoryMaterialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.inventoryMaterialForm.controls) {
        this.inventoryMaterialForm.controls[i].markAsDirty();
        this.inventoryMaterialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const inventoryMaterial = Object.assign({}, this.inventoryMaterialForm.value);
    this.inventoryMaterialService.addNew(inventoryMaterial).subscribe((res: number) => {
      if (res) {
        this.notify.success('Thêm mới thành công!');
        this.router.navigate(['/nghiep-vu/kho/phieu-kiem-ke-kho/sua-phieu-kiem-ke', res]);
      }
    });
  }
}
