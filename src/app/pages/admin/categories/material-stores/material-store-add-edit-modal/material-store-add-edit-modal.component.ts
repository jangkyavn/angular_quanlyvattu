import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { MaterialStore } from 'src/app/shared/models/material-store.model';
import { MaterialStoreService } from 'src/app/shared/services/material-store.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-material-store-add-edit-modal',
  templateUrl: './material-store-add-edit-modal.component.html',
  styleUrls: ['./material-store-add-edit-modal.component.scss']
})
export class MaterialStoreAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  materialStore: MaterialStore;

  isAddNew: boolean;

  materialStoreForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private materialStoreService: MaterialStoreService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.materialStoreForm.reset();
    this.materialStoreForm.patchValue(this.materialStore);
  }

  createForm() {
    this.materialStoreForm = this.fb.group({
      maKho: [null],
      tenKho: [null, [Validators.required]],
      dienThoai: [null, [Validators.required]],
      diaChi: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    const materialStore = Object.assign({}, this.materialStoreForm.value);
    if (this.isAddNew) {
      this.materialStoreService.addNew(materialStore).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addMaterialStore');
      });
    } else {
      this.materialStoreService.update(materialStore).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateMaterialStore');
      });
    }
  }

  hideModal() {
    if (this.materialStoreForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
