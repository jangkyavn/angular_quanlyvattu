import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Material } from 'src/app/shared/models/material.model';
import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { UnitService } from 'src/app/shared/services/unit.service';
import { Unit } from 'src/app/shared/models/unit.model';

@Component({
  selector: 'app-material-add-edit-modal',
  templateUrl: './material-add-edit-modal.component.html',
  styleUrls: ['./material-add-edit-modal.component.scss']
})
export class MaterialAddEditModalComponent implements OnInit {
  @Input() material: Material;
  @Input() isAddNew: boolean;
  materialTypes: MaterialType[];
  units: Unit[];

  materialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private materialTypeService: MaterialTypeService,
    private unitService: UnitService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialTypes();
    this.loadAllUnits();
    this.createForm();
    this.materialForm.reset();
    this.materialForm.patchValue(this.material);
  }

  createForm() {
    this.materialForm = this.fb.group({
      maVatTu: [null],
      tenVT: [null, [Validators.required]],
      maLoaiVatTu: [null, [Validators.required]],
      maDVT: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.materialForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.materialForm.controls) {
        this.materialForm.controls[i].markAsDirty();
        this.materialForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const material = Object.assign({}, this.materialForm.value);
    if (this.isAddNew) {
      this.materialService.addNew(material).subscribe((res: any) => {
        if (res) {
          this.notify.success('Thêm thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMaterial');
        callBack(false);
      });
    } else {
      this.materialService.update(material).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMaterial');
        callBack(false);
      });
    }
  }

  loadAllMaterialTypes() {
    this.materialTypeService.getAll().subscribe((res: MaterialType[]) => {
      this.materialTypes = res;
    });
  }

  loadAllUnits() {
    this.unitService.getAll().subscribe((res: Unit[]) => {
      this.units = res;
    });
  }
}
