import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { MaterialType } from 'src/app/shared/models/material-type.model';
import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { MaterialItem } from 'src/app/shared/models/material-item.model';

@Component({
  selector: 'app-material-type-add-edit-modal',
  templateUrl: './material-type-add-edit-modal.component.html',
  styleUrls: ['./material-type-add-edit-modal.component.scss']
})
export class MaterialTypeAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  materialType: MaterialType;
  materialItems: MaterialItem[];
  submitted = false;
  isAddNew: boolean;

  materialTypeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private materialTypeService: MaterialTypeService,
    private materialItemService: MaterialItemService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialItems();
    this.createForm();
  }

  ngAfterViewInit() {
    this.materialTypeForm.reset();
    this.materialTypeForm.patchValue(this.materialType);
  }

  createForm() {
    this.materialTypeForm = this.fb.group({
      maLoaiVatTu: [null],
      tenLoai: [null, [Validators.required]],
      maHM: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    this.submitted = true;

    if (this.materialTypeForm.invalid) {
      return;
    }

    const materialType = Object.assign({}, this.materialTypeForm.value);
    if (this.isAddNew) {
      this.materialTypeService.addNew(materialType).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMaterialType');
      });
    } else {
      this.materialTypeService.update(materialType).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMaterialType');
      });
    }
  }

  loadAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
  }

  hideModal() {
    if (this.materialTypeForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
