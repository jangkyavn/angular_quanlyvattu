import { Component, OnInit, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Manufacturer } from 'src/app/shared/models/manufacturer.model';
import { ManufacturerService } from 'src/app/shared/services/manufacturer.service';
import { NotifyService } from 'src/app/shared/services/notify.service';

@Component({
  selector: 'app-manufacturer-add-edit-modal',
  templateUrl: './manufacturer-add-edit-modal.component.html',
  styleUrls: ['./manufacturer-add-edit-modal.component.scss']
})
export class ManufacturerAddEditModalComponent implements OnInit {
  @Input() manufacturer: Manufacturer;
  @Input() isAddNew: boolean;

  manufacturerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.createForm();
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

  saveChanges(callBack: (result: boolean) => any = null) {
    if (this.manufacturerForm.invalid) {
      // tslint:disable-next-line:forin
      for (const i in this.manufacturerForm.controls) {
        this.manufacturerForm.controls[i].markAsDirty();
        this.manufacturerForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    const manufacturer = Object.assign({}, this.manufacturerForm.value);
    if (this.isAddNew) {
      this.manufacturerService.addNew(manufacturer).subscribe((res: any) => {
        if (typeof res === 'boolean') {
          if (res) {
            this.notify.success('Thêm thành công!');
            callBack(true);
          }
        } else {
          if (res === -1) {
            this.notify.warning('Tên hãng sản xuất đã tồn tại');
          }
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error addManufacturer');
        callBack(false);
      });
    } else {
      this.manufacturerService.update(manufacturer).subscribe((res: any) => {
        if (res) {
          this.notify.success('Sửa thành công!');
          callBack(true);
        }
      }, error => {
        this.notify.success('Có lỗi xảy ra!');
        console.log('error updateManufacturer');
        callBack(false);
      });
    }
  }
}
