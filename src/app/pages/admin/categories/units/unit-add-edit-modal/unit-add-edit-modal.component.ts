import { Component, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Unit } from 'src/app/shared/models/unit.model';
import { UnitService } from 'src/app/shared/services/unit.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-unit-add-edit-modal',
  templateUrl: './unit-add-edit-modal.component.html',
  styleUrls: ['./unit-add-edit-modal.component.scss']
})
export class UnitAddEditModalComponent implements OnInit, AfterViewInit {
  @Output() saveEntity = new EventEmitter<boolean>();
  title: string;
  unit: Unit;

  isAddNew: boolean;

  unitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public bsModalRef: BsModalRef,
    private unitService: UnitService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.unitForm.reset();
    this.unitForm.patchValue(this.unit);
  }

  createForm() {
    this.unitForm = this.fb.group({
      maDVT: [null],
      tenDVT: [null, [Validators.required]],
    });
  }

  saveChanges() {
    const unit = Object.assign({}, this.unitForm.value);
    if (this.isAddNew) {
      this.unitService.addNew(unit).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Thêm thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addNewUnit');
      });
    } else {
      this.unitService.update(unit).subscribe((res: any) => {
        if (res) {
          this.saveEntity.emit(true);
          this.notify.success('Sửa thành công!');
          this.bsModalRef.hide();
        }
      }, error => {
        this.saveEntity.emit(false);
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateUnit');
      });
    }
  }

  hideModal() {
    if (this.unitForm.dirty) {
      const result = confirm('Bạn có chắc chắn muốn tiếp tục không? Mọi sự thay đổi không lưu sẽ bị mất');
      if (result) {
        this.bsModalRef.hide();
      }
    } else {
      this.bsModalRef.hide();
    }
  }
}
