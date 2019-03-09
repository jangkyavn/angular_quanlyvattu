import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { MaterialTypeService } from 'src/app/shared/services/material-type.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialType } from 'src/app/shared/models/material-type.model';
import { noWhitespaceValidator } from 'src/app/shared/vailidators/no-whitespace-validator';

@Component({
  selector: 'app-material-type-add-edit-modal',
  templateUrl: './material-type-add-edit-modal.component.html',
  styleUrls: ['./material-type-add-edit-modal.component.scss']
})
export class MaterialTypeAddEditModalComponent implements OnInit {
  @Input() materialType: MaterialType;
  @Input() isAddNew: boolean;
  materialItems: MaterialItem[];

  materialTypeForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private materialTypeService: MaterialTypeService,
    private materialItemService: MaterialItemService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.loadAllMaterialItems();
    this.createForm();
    this.materialTypeForm.reset();
    this.materialTypeForm.patchValue(this.materialType);
  }

  createForm() {
    this.materialTypeForm = this.fb.group({
      maLoaiVatTu: [null],
      tenLoai: [null, [Validators.required, noWhitespaceValidator]],
      maHM: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    if (this.materialTypeForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.materialTypeForm.controls) {
        this.materialTypeForm.controls[i].markAsDirty();
        this.materialTypeForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const materialType = Object.assign({}, this.materialTypeForm.value);
    if (this.isAddNew) {
      this.materialTypeService.addNew(materialType).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên loại vật tư đã tồn tại');
          }
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error addMaterialType');
        this.modal.destroy(false);
      });
    } else {
      this.materialTypeService.update(materialType).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.error('Có lỗi xảy ra!');
        console.log('error updateMaterialType');
        this.modal.destroy(false);
      });
    }
  }

  loadAllMaterialItems() {
    this.materialItemService.getAll().subscribe((res: MaterialItem[]) => {
      this.materialItems = res;
    });
  }
}
