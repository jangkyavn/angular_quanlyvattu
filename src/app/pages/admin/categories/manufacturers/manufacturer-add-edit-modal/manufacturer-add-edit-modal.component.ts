import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-manufacturer-add-edit-modal',
  templateUrl: './manufacturer-add-edit-modal.component.html',
  styleUrls: ['./manufacturer-add-edit-modal.component.scss']
})
export class ManufacturerAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  manufacturer: Manufacturer;
  submitted = false;
  isAddNew: boolean;

  manufacturerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private manufacturerService: ManufacturerService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.manufacturerForm.reset();
    this.manufacturerForm.patchValue(this.manufacturer);
  }

  createForm() {
    this.manufacturerForm = this.fb.group({
      maHang: [null],
      tenHang: [null, [Validators.required]],
      ghiChu: [null]
    });
  }

  saveChanges() {
    this.submitted = true;

    if (this.manufacturerForm.invalid) {
      return;
    }

    const manufacturer = Object.assign({}, this.manufacturerForm.value);
    if (this.isAddNew) {
      this.manufacturerService.addNew(manufacturer).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addManufacturer');
      });
    } else {
      this.manufacturerService.update(manufacturer).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateManufacturer');
      });
    }
  }

  hideModal() {
    if (this.manufacturerForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
