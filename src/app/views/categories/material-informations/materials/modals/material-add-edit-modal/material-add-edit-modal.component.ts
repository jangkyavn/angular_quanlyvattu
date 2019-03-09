import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { MaterialService } from 'src/app/shared/services/material.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { UnitService } from 'src/app/shared/services/unit.service';

import { Material } from 'src/app/shared/models/material.model';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { Unit } from 'src/app/shared/models/unit.model';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

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

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
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
      tenVT: [null, [Validators.required, noWhitespaceValidator]],
      maLoaiVatTu: [null, [Validators.required]],
      maDVT: [null],
      ghiChu: [null]
    });
  }

  saveChanges() {
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
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên vật tư đã tồn tại');
          }
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error addMaterial');
        this.modal.destroy(false);
      });
    } else {
      this.materialService.update(material).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error updateMaterial');
        this.modal.destroy(false);
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
