import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

import { UnitService } from 'src/app/shared/services/unit.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

import { Unit } from 'src/app/shared/models/unit.model';

@Component({
  selector: 'app-unit-add-edit-modal',
  templateUrl: './unit-add-edit-modal.component.html',
  styleUrls: ['./unit-add-edit-modal.component.scss']
})
export class UnitAddEditModalComponent implements OnInit {
  @Input() unit: Unit;
  @Input() isAddNew: boolean;
  unitForm: FormGroup;

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode === 13) {
      this.saveChanges();
    }
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private unitService: UnitService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
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
    if (this.unitForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.unitForm.controls) {
        this.unitForm.controls[i].markAsDirty();
        this.unitForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const unit = Object.assign({}, this.unitForm.value);
    if (this.isAddNew) {
      this.unitService.addNew(unit).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            this.modal.destroy(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên đơn vị tính đã tồn tại');
          }
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addNewUnit');
        this.modal.destroy(false);
      });
    } else {
      this.unitService.update(unit).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          this.modal.destroy(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateUnit');
        this.modal.destroy(false);
      });
    }
  }
}
