import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { MaterialItem } from 'src/app/shared/models/material-item.model';
import { MaterialItemService } from 'src/app/shared/services/material-item.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-material-item-add-edit-modal',
  templateUrl: './material-item-add-edit-modal.component.html',
  styleUrls: ['./material-item-add-edit-modal.component.scss']
})
export class MaterialItemAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  materialItem: MaterialItem;

  isAddNew: boolean;

  materialItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private materialItemService: MaterialItemService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.materialItemForm.reset();
    this.materialItemForm.patchValue(this.materialItem);
  }

  createForm() {
    this.materialItemForm = this.fb.group({
      maHM: [null],
      tenHM: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    const materialItem = Object.assign({}, this.materialItemForm.value);
    if (this.isAddNew) {
      this.materialItemService.addNew(materialItem).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMMaterialItem');
      });
    } else {
      this.materialItemService.update(materialItem).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMMaterialItem');
      });
    }
  }

  hideModal() {
    if (this.materialItemForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
