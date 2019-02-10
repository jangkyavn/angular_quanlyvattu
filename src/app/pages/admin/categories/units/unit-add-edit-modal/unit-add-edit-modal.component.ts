import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Unit } from 'src/app/shared/models/unit.model';
import { UnitService } from 'src/app/shared/services/unit.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-unit-add-edit-modal',
  templateUrl: './unit-add-edit-modal.component.html',
  styleUrls: ['./unit-add-edit-modal.component.scss']
})
export class UnitAddEditModalComponent implements OnInit {
  @Input() unit: Unit;
  @Input() isAddNew: boolean;

  unitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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

  saveChanges(callBack: (result: boolean) => any = null) {
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
        if (res) {
          this.notify.success('Thêm thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addNewUnit');
        callBack(true);
      });
    } else {
      this.unitService.update(unit).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateUnit');
        callBack(true);
      });
    }
  }
}
