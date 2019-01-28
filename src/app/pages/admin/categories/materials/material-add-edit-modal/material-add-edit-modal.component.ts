import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

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
export class MaterialAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  material: Material;
  materialTypes: MaterialType[];
  units: Unit[];
  submitted = false;
  isAddNew: boolean;

  materialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private materialService: MaterialService,
    private materialTypeService: MaterialTypeService,
    private unitService: UnitService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialTypes();
    this.loadAllUnits();
    this.createForm();
  }

  ngAfterViewInit() {
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

  saveChanges() {
    this.submitted = true;

    if (this.materialForm.invalid) {
      return;
    }

    const material = Object.assign({}, this.materialForm.value);
    if (this.isAddNew) {
      this.materialService.addNew(material).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMaterial');
      });
    } else {
      this.materialService.update(material).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMaterial');
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

  hideModal() {
    if (this.materialForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
